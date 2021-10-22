# Demo Subgraph (The Graph) showcasing unit testing with Matchstick!

❗ This repository reflects the changes made in the latest version of [Matchstick](https://github.com/LimeChain/matchstick/) (a.k.a. it follows the main branch).

## Help
```sh
$ ./matchstick -h
Matchstick 🔥 0.2.0
Limechain <https://limechain.tech>
Unit testing framework for Subgraph development on The Graph protocol.

USAGE:
    matchstick [test_names]...

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

ARGS:
    <test_names>...    Please specify the names of the tests you would like to run.
```

## Conventions

### Directory structure

For **Matchstick** to recognize your tests, you need to put them in a `tests/` folder in the root of your project.

### Naming

Your test file should start with a name of your chosing (for example the name of the tested data source) and end with `.test.ts`.
For instance:
```
tests/
└── gravity.test.ts

1 file
```

---

You can also group related tests and other files into folders.
For example:
```
tests/
└── gravity
    ├── gravity.test.ts
    └── utils.ts

1 directory, 2 files
```

Now, under the `gravity` folder, all files ending with `.test.ts` are interpreted as a single test with the name `gravity` (the name of the folder).

## Caveats

 - **Matchstick** is case-insensitive regarding data sources names. Meaning, *Gravity = gravity = gRaVitY*.
