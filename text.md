# Tokens to Figma script

Links:

[Figma Developer API](https://www.figma.com/developers/api)

[Figma.cjs script](https://github.com/RedHat-UX/red-hat-design-tokens/blob/feat/figma-workflow/scripts/figma.cjs)

To push our tokens to Figma the file `rhds.tokens.json` is looped through and added to a payload inside of the script.

This is done in three steps: 

1. [Creating the collection](#collection)
2. [Looping through the tokens](#tokens)
3. [Pushing to Figma](#push-to-figma)

## Running the script

The script can be run with the following:

```bash
npm run figma -- [yourApiToken] [yourFileId]
```

The `yourApiToken` is your personal Figma API token. This can be found in the Figma account settings.

The `yourFileId` is the file id of the Figma file you want to push the tokens to. This can be found in the URL of the Figma file.

The brackets `[]` are not needed in the command.

# Collection

The collections are created by calling the `createCollection` function. This function will create an object in the global figmapApiPayload object under `variableCollections`. 

The collections variable can be found on line 7 of the script.  We create the following collections:

- `default` - The default collection for the tokens
  - Default mode is `default` 
- `dark` - The dark mode tokens
  - Default mode is `dark` 
- `light` - The light mode tokens
  - Default mode is `light` 
- `color` - The color pallete tokens
  - Default mode is `color` 
- `semantic` - The light and dark mode collections combined.  
  - Default mode is `semantic-light`
  - Contains the second mode of `semantic-dark`.

# Tokens

The tokens are looped through by calling the `loopTokens` function. This function will take the values in the JSON file and format them into the correct format for the Figma API.

This happens in four steps:

- Determine the type of the token
- Determine the value of the token
- Determine the collection for the token
- Add the token to the payload

#### Determine the type of the token

There are three types of tokens supported by this script:

- `COLOR` - A color token
- `FLOAT` - A number token
- `STRING` - Everything else  

#### Determine the value of the token

`COLOR` - We parse whether or not the color is specific to a light or dark theme.  Then the color is parsed into an object with the keys `r`, `g`, and `b`.  

If the value is not specific to a light or dark theme, we add the value to the `color` collection.

If the value is specific to a light or dark theme, we add the value to the `light` or `dark` collection.  We also add the value to the `semantic` collection.

For all other tokens, we add the value to the `default` collection.

# Push to Figma

We take the completed payload and `POST` it to the Figma API. The API will return a response with the collection and tokens.