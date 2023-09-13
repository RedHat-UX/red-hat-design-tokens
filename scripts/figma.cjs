const process = require('process');

const [,, apiToken, fileId] = process.argv;

const rhdsTokens = require('../build/rhds.tokens.json');

const fileName = `test-${new Date().toISOString().slice(0, 10)}`;
const defaultModeId = 'default';

const figmaApiPayload = {
  variableCollections: [],
  variables: [],
  variableModeValues: [],
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

const createCollection = (name, initialModeId) => {
  /**
    * Standard format for creating a collection
    * {
    *   action
    *   id
    *   name
    *   initialModeId
    * }
    */
  figmaApiPayload.variableCollections.push({
    action: 'CREATE',
    id: name,
    name,
    initialModeId,
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

const getTokenKey = (type, key, object) => {
  if (type === 'FLOAT') {
    const [measurement] = object.$value.match(/(px|rem)$/);
    return `${key}${typeof measurement !== 'undefined' ? ` (${measurement})` : ''}/--${object?.name}`;
  } else if (type === 'COLOR') {
    return `${key}/--${object?.name}`;
  }
  return `${key}/--${object?.name}`;
};

const getTokenValue = (type, object) => {
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

const traverseToken = (collection, modeId, type, key, object) => {
  type = type || object?.$type;
  if (key.charAt(0) === '$') {
    return;
  }
  if (object?.$value !== undefined) {
    const tokenType = getTokenType(type, object);
    const tokenKey = getTokenKey(tokenType, key, object);
    const tokenValue = getTokenValue(tokenType, object);
    createToken(
      collection,
      modeId,
      tokenType,
      tokenKey,
      tokenValue,
    );
  } else {
    if (typeof object !== 'undefined') {
      Object.entries(object).forEach(([key2, object2]) => {
        if (key2.charAt(0) !== '$') {
          traverseToken(
            collection,
            modeId,
            type,
            `${key}/${key2}`,
            object2,
          );
        }
      });
    }
  }
};

const loopTokens = (rhdsTokens, modeId) => {
  Object.entries(rhdsTokens).forEach(([key, value]) => {
    traverseToken(
      fileName,
      modeId,
      rhdsTokens.$type,
      key,
      value,
    );
  });
};

const importJSONFile = async () => {
  createCollection(fileName, defaultModeId);
  loopTokens(rhdsTokens, defaultModeId);
  await callFigmaCreateApi(figmaApiPayload);
};

importJSONFile();
