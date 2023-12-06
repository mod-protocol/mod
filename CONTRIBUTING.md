# Set up for local development

First, ensure that the following are installed globally on your machine:

- Node.js 18.7+
- Yarn

1. In the root directory, run `yarn install`
2. Run all packages by running `yarn dev` from the root folder.
3. To run any individual package from it's directory, run `yarn dev`, but you may need to rebuild any other packages

- Example: [http://localhost:3000](http://localhost:3000)
- Api: [http://localhost:3001](http://localhost:3001)
- Docs: [http://localhost:3002](http://localhost:3002)

## Navigating the repo

```
├── ./examples → Boilerplates to implement Mod protocol in your apps
│   ├── ./examples/api → An open source next.js backend for endpoints
│   ├── ./examples/nextjs-shadcn → A boilerplate next.js starter
├── ./mods → All the current Mod protocol Mods
├── ./docs → An .mdx based docs site
├── ./packages → The core Mod protocol libraries
│   ├── ./packages/core → The core library that takes a Mod configuration and produces a JS Mod
│   ├── ./packages/farcaster → Some farcaster specific types and utilities
│   ├── ./packages/mod-registry → A list of all the current Mods
│   ├── ./packages/react → Renders a mod using a UI renderer into a React component for the web
│   ├── ./packages/react-ui-shadcn → A set of default UI renderers for web, using react, shadcn/ui and tailwind
│   ├── ./packages/react-editor → The web based rich text editor based on tiptap.dev
│   ├── ./packages/tiptap-extension-link → An extension for the web based rich text editor to handle links
```

# Changesets

All PRs with meaningful changes should have a changeset which is a short description of the modifications being made to each package. Changesets are automatically converted into a changelog when the repo manager runs a release process.

## Add a new changeset

yarn changeset

## Create new versions of packages

yarn changeset version

## Publish all changed packages to npm

yarn changeset publish
