# Demo Subgraph (The Graph) showcasing unit testing with Matchstick!

❗ This repository reflects the changes made in the latest version of [Matchstick](https://github.com/LimeChain/matchstick/) (a.k.a. it follows the main branch).

## Help
```sh
$ ./matchstick -h
Matchstick 🔥 0.2.0
Limechain <https://limechain.tech>
Unit testing framework for Subgraph development on The Graph protocol.

USAGE:
    matchstick [test_suites]...

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

ARGS:
    <test_suites>...    Please specify the names of the test suites you would like to run.
```

## Conventions

### Directory structure

For **Matchstick** to recognize your test suites, you need to put them in a `tests/` folder in the root of your project.

**NOTE**: A *Test Suite* is simply a collection of `test(...)` function calls. They can be put into a single file or
many files grouped into a directory.

### Naming

Your test files should start with a name of your chosing (for example the name of the tested data source) and end with `.test.ts`.
For instance:
```
tests/
└── gravity.test.ts

1 file
```

The test suite name is: `gravity`.

---

As mentioned, you can also group related tests and other files into folders.
For example:
```
tests/
└── gravity
    ├── gravity.test.ts
    └── utils.ts

1 directory, 2 files
```

Now, under the `gravity` folder, all files ending with `.test.ts` are interpreted as a single test suite with the name `gravity` (the name of the folder).

## Caveats

 - **Matchstick** is case-insensitive when it comes to test suite names. Meaning, *Gravity = gravity = gRaVitY*.
