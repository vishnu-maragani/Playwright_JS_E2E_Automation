// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { worker } from 'node:cluster';

/**
 * @see https://playwright.dev/docs/test-configuration
 */


const config = {
  testDir:'./tests',
  timeout:60*1000,
  expect:{
    timeout:10000
  },
  reporter:'html',
  workers: process.env.CI ? 1 : undefined,
  use:{
    browserName: 'chromium',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'on'
  }

}
module.exports = config;