import { assert, test, describe, log, beforeAll, afterAll, beforeEach, afterEach } from 'matchstick-as/assembly/index'
import { Address, BigInt, Bytes, ethereum, store, Value } from "@graphprotocol/graph-ts"

beforeAll(() => {
  log.error("Run once at the beginning", [])
})
afterAll(() => {
  log.error("Run once at the end", [])
})
beforeEach(() => {
  log.warning("Run once before each describe", [])
})
afterEach(() => {
  log.warning("Run once after each describe", [])
})

describe('describe 1', () => {
  beforeAll(() => {
    log.info("Run before all tests in describe 1", [])
  })
  afterAll(() => {
    log.info("Run after all tests in describe 1", [])
  })
  beforeEach(() => {
    log.debug("Run before each test in describe 1", [])
  })
  afterEach(() => {
    log.debug("Run after each test in describe 1", [])
  })

  test('First test in describe1', () => {
    // assert.assertTrue(true)
  })

  test('Second test in describe2', () => {
    // assert.assertTrue(true)
  })
})

describe('describe 2', () => {
  beforeAll(() => {
    log.info("Run before all tests in describe 2", [])
  })
  afterAll(() => {
    log.info("Run after all tests in describe 2", [])
  })
  beforeEach(() => {
    log.debug("Run before each test in describe 2", [])
  })
  afterEach(() => {
    log.debug("Run after each test in describe 2", [])
  })

  test('First test in describe 2', () => {
    // assert.assertTrue(false)
  })

  test('Second test in describe 2', () => {
    // true
  })
})
