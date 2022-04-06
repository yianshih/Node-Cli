#!/usr/bin/env node

require("module-alias/register");

import { main as home } from "@cli/questions/home";

home();
