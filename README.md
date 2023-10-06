# README

This is the monorepo for the packages of `Mod protocol`

[Read the docs](https://docs.modprotocol.org)
[See an example](https://example-nextjs.modprotocol.org)
[Website](https://www.modprotocol.org)

## Table of contents

```
├── ./examples → Boilerplates to implement Mod protocol in your apps
│   ├── ./examples/api → An open source next.js backend for endpoints
│   ├── ./examples/expo-react-native → A boilerplate expo react-native starter
│   ├── ./examples/nextjs-shadcn → A boilerplate next.js starter
├── ./miniapps → All the current Mod protocol Mini-apps
├── ./docs → An .mdx based docs site
├── ./packages → The core Mod protocol libraries
│   ├── ./packages/core → The core library that takes a Miniapp configuration and produces a JS Miniapp
│   ├── ./packages/creation-react-native-headless → The react-native rich text editor
│   ├── ./packages/farcaster → Some farcaster specific types and utilities
│   ├── ./packages/miniapp-registry → A list of all the current Mini-apps
│   ├── ./packages/react → Renders a mini-app using a UI renderer into a React component for the web
│   ├── ./packages/react-ui-shadcn → A set of default UI renderers for web, using react, shadcn/ui and tailwind
│   ├── ./packages/react-editor → The web based rich text editor based on tiptap.dev
│   ├── ./packages/tiptap-extension-link → An extension for the web based rich text editor to handle links
```

## Local development

1. In the root directory, run `yarn install`
2. Run any individual package from it's directory, run `yarn dev`
