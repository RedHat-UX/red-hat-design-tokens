const process = require('process');

const [,, apiToken, fileId] = process.argv;

const rhdsTokens = require('../build/rhds.tokens.json');

const collections = {
  default: {
    name: 'General',
    modeId: 'default',
  },
  dark: {
    name: 'Base colors - dark',
    modeId: 'dark',
  },
  light: {
    name: 'Base colors - light',
    modeId: 'light',
  },
  color: {
    name: 'Color Palette',
    modeId: 'color',
  },
  semantic: {
    name: 'Semantic colors',
    modeId: 'semantic-light',
    secondaryModeId: 'semantic-dark',
  },
};

const figmaApiPayload = {
  variableCollections: [],
  variables: [],
  variableModes: [],
  variableModeValues: []
};

const parseColor = color => {
  const _color = color.trim();
  const expandedHex =
    _color.length === 3 ?
      _color
        .split('')
        .map(char => char + char)
        .join('')
      : _color;
  return {
    r: parseInt(expandedHex.slice(0, 2), 16) / 255,
    g: parseInt(expandedHex.slice(2, 4), 16) / 255,
    b: parseInt(expandedHex.slice(4, 6), 16) / 255,
  };
};

const callFigmaCreateApi = async body => {
  return await fetch(
    `https://api.figma.com/v1/files/${fileId}/variables`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'X-FIGMA-TOKEN': apiToken,
        'Content-Type': 'application/json',
      },
    }).then(response => response.json());
};

const createSecondaryMode = (name, variableCollectionId) => {
  /**
   * Standard format for creating a mode
   * {
   *  action
   *  name
   *  variableCollectionId
   * }
   */
  figmaApiPayload.variableModes.push({
    action: 'CREATE',
    id: name,
    name,
    variableCollectionId,
  });
};

const createCollections = () => {
  /**
    * Standard format for creating a collection
    * {
    *   action
    *   id
    *   name
    *   initialModeId
    * }
    */
  Object.entries(collections).forEach(([, { name, modeId, secondaryModeId }]) => {
    figmaApiPayload.variableCollections.push({
      action: 'CREATE',
      id: name,
      name,
      initialModeId: modeId,
    });
    if (secondaryModeId) {
      createSecondaryMode(secondaryModeId, name);
    }
  });
};

const createToken = (
  variableCollectionId,
  modeId,
  resolvedType,
  name,
  value
) => {
  /**
   * Standard format for creating a mode value
   * {
   *  variableId,
   *  modeId,
   *  value
   * }
   */
  figmaApiPayload.variableModeValues.push({
    variableId: name,
    modeId,
    value,
  });

  /**
    * Standard format for creating a token
    * {
    *   action,
    *   id,
    *   name,
    *   resolvedType, (COLOR, STRING, FLOAT)
    *   variableCollectionId (name of the collection)
    * }
    */
  figmaApiPayload.variables.push({
    action: 'CREATE',
    id: name,
    name,
    resolvedType,
    variableCollectionId,
  });
};

const getTokenType = (type, object) => {
  if (object.$value.toString().match(/(px|rem)$/) || type === 'number') {
    return 'FLOAT';
  } else if (type === 'color') {
    return 'COLOR';
  }
  return 'STRING';
};

const getColorTheme = object => {
  if (object.name.toString().match(/(light|dark)$/)) {
    const [theme] = object.name.toString().match(/(light|dark)$/);
    return theme;
  }
  return undefined;
};

const getCollection = object => {
  if (object.name.toString().match(/light(er|est)?$/)) {
    return collections.light;
  } else if (object.name.toString().match(/dark(er|est)?$/)) {
    return collections.dark;
  } else if (object.name.toString().match(/color(?!.*(hsl|rgb))/)) {
    return collections.color;
  }
  return collections.default;
};

const getTokenValue = (type, object) => {
  if (object.original?.$value !== undefined && object.original?.$value.toString().indexOf('{') > -1) {
    const modifiableValue = object.original.$value.toString().replace('{', '').replace('}', '');
    const originalValue = modifiableValue.replaceAll('.', '-').toString();
    const originalPath = modifiableValue.split('.').slice(0, -1).join('/');

    return {
      id: `${originalPath}/--rh-${originalValue}`,
      type: 'VARIABLE_ALIAS'
    };
  }
  if (type === 'FLOAT') {
    let measurement = undefined;
    const value = object?.$value.toString();
    [measurement] = object.$value.match(/(px|rem)$/);
    if (measurement) {
      return Number.parseFloat(value.replace(measurement[0], ''));
    }
    return object?.$value;
  } else if (type === 'COLOR') {
    return parseColor(object?.attributes?.hex);
  }
  return object?.$value.toString();
};

const createSemanticToken = (name, type, path, value, stringMatch) => {
  if (name.match(stringMatch)) {
    const theme = name.match(/light(er|est)?|white/) ? collections.semantic.modeId : name.match(/dark(er|est)?|black/) ? collections.semantic.secondaryModeId : undefined;

    // Fixing up the name
    name = name.replace(/light(er|est)?|white/, '');
    name = name.replace(/dark(er|est)?|black/, '');
    name = name.replace(/-$/, '');
    name = name.replace(/-on$/, '');

    const variableExists = figmaApiPayload.variables.find(variable => variable.id === name);
    if (variableExists) {
      figmaApiPayload.variables.push({
        action: 'UPDATE',
        id: name,
        value,
        variableCollectionId: collections.semantic.name,
        modeId: theme,
      });
    } else {
      createToken(
        collections.semantic.name,
        theme,
        type,
        `${path}/${name}`,
        value
      );
    }
  }
};

const traverseToken = (type, key, object) => {
  type = type || object?.$type;
  if (key.charAt(0) === '$') {
    return;
  }
  if (object?.$value !== undefined) {
    const tokenType = getTokenType(type, object);
    const tokenValue = getTokenValue(tokenType, object);
    const collection = getCollection(object);
    if (tokenType === 'COLOR') {
      const colorTheme = getColorTheme(object);
      if (colorTheme) {
        createToken(
          collection.name,
          collection.name === collections.color.name ? collection.modeId[colorTheme] : collection.modeId,
          tokenType,
          `${object.path.slice(0, -1).join('/')}/${colorTheme ? `${colorTheme}/` : ''}--${object?.name}`,
          tokenValue
        );
        createSemanticToken(
          object.name,
          tokenType,
          object.path.slice(0, -1).join('/'),
          tokenValue,
          /(light|dark)$/
        );
      }
      if (object.name.toString().match(/(white|black)$/)) {
        createSemanticToken(
          object.name,
          tokenType,
          object.path.slice(0, -1).join('/'),
          tokenValue,
          /(white|black)$/
        );
      }
    }
    createToken(
      collection.name,
      collection.modeId,
      tokenType,
      // Join all items in an array except the last one
      `${object.path.slice(0, -1).join('/')}/--${object?.name}`,
      tokenValue
    );
  } else {
    if (typeof object !== 'undefined') {
      Object.entries(object).forEach(([key2, object2]) => {
        if (key2.charAt(0) !== '$') {
          traverseToken(
            type,
            `${key}/${key2}`,
            object2,
          );
        }
      });
    }
  }
};

const loopTokens = () => {
  Object.entries(rhdsTokens).forEach(([key, value]) => {
    traverseToken(
      rhdsTokens.$type,
      key,
      value,
    );
  });
};

const importJSONFile = async () => {
  createCollections();

  loopTokens();

  const res = await callFigmaCreateApi(figmaApiPayload);
  console.log(res);
};

importJSONFile();
