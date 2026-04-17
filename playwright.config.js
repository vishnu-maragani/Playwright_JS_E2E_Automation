// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */


const config = {
  testDir:'./tests',
  timeout:40*1000,
  expect:{
    timeout:5000
  },
  reporter:'html',
  use:{
    browserName:'chromium',
    headless:true,
    trace:'retain-on-failure',
    screenshot:'on'
  }

}
module.exports = config;