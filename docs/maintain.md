# Testing and maintaining

## Develop this package in isolation

This runs the tests in watch mode:

```sh
pnpm i

pnpm start
```

## Develop while manually testing in another project

> Reference: https://pnpm.io/cli/link

Inside another project, link your version of the package:

```sh
pnpm link ./packages/css-clamper # `./` in the start is important — this is how `pnpm link` knows that it is a relative path.

cd packages/css-clamper

pnpm i

pnpm dev

# Leave this terminal running for Hot Reload.
```

In another terminal, just execute `pnpm start` at your project, or restart if it's already running. Good to go!

### When you're done

In your project root execute:

```sh
pnpm unlink css-clamper
```

You may also want to stop the terminal running `pnpm dev`.

No need to stop the `pnpm start` terminal (if you have it running).
