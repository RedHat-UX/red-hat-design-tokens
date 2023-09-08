const rhdsTokens = require('../build/rhds.tokens.json');

const apiToken = '';
const fileId = '';

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
  const response = await fetch(
    `https://api.figma.com/v1/files/${fileId}/variables`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'X-FIGMA-TOKEN': apiToken,
        'Content-Type': 'application/json',
      },
    });
  return response.json();
};

const createCollection = (name, initialModeId) => {
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
  figmaApiPayload.variableModeValues.push({
    variableId: name,
    modeId,
    value,
  });
  figmaApiPayload.variables.push({
    action: 'CREATE',
    id: name,
    name,
    resolvedType,
    variableCollectionId,
  });
};

const traverseToken = (collection, modeId, type, key, object) => {
  type = type || object?.$type;
  if (key.charAt(0) === '$') {
    return;
  }
  if (object?.$value !== undefined) {
    if (object?.$value.toString().match(/(px|rem)$/)) {
      type = 'number';
    }
    if (type === 'color') {
      createToken(
        collection,
        modeId,
        'COLOR',
        `${key}/--${object?.name}`,
        parseColor(object?.attributes?.hex)
      );
    } else if (type === 'number') {
      let measurement = undefined;
      const value = object?.$value.toString();
      [measurement] = value.match(/(px|rem)$/);
      if (measurement) {
        object.$value = Number.parseFloat(value.replace(measurement[0], ''));
      }
      createToken(
        collection,
        modeId,
        'FLOAT',
        `${key}${
          typeof measurement !== 'undefined' ? ` (${measurement})` : ''
        }/--${object?.name}`,
        object?.$value
      );
    } else {
      createToken(
        collection,
        modeId,
        'STRING',
        `${key}/--${object?.name}`,
        object?.$value.toString()
      );
    }
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
  const modeId = defaultModeId;
  loopTokens(rhdsTokens, modeId);
  console.log(figmaApiPayload)
  await callFigmaCreateApi(figmaApiPayload);
};

importJSONFile();
