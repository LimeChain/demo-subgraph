# Demo Subgraph (The Graph) showcasing unit testing with Matchstick!

❗ This repository reflects the changes made in the latest version of [Matchstick](https://github.com/LimeChain/matchstick/) (a.k.a. it follows the main branch).

## Help
```sh
$ ./matchstick -h
Matchstick 🔥 x.y.z
Limechain <https://limechain.tech>
Unit testing framework for Subgraph development on The Graph protocol.

USAGE:
    matchstick [datasources]...

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

ARGS:
    <datasources>...    Please specify the names of the data sources you would like to test.
```

## Conventions

### Directory structure

For Matchstick to recognize your tests, you need to put them in a `tests/` folder in the root of your project.

### Naming

Your test file should start with the name of your data source and end with `.test.ts`.
For example:
```
tests/
└── gravity.test.ts

1 file
```

--

If you want to group unit tests in subfolders, name the subfolders as your data sources are named.
For example:
```
tests/
└── gravity
    ├── gravity.test.ts
    └── utils.ts

1 directory, 2 files
```

Now, under the `gravity` folder, all files ending with `.test.ts` are interpreted as unit tests for the `Gravity` data source.

## Caveats

 - Matchstick is case-insensitive regarding data sources names. Meaning, *Gravity = gravity = gRaVitY*.
