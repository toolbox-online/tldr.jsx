//@flow

/*******************************************************************************
 * Imports
 *******************************************************************************/

import React from "react";

import Tldr from "./Tldr";
import Link from "./Link";
import { Markdown, Cr } from "./Markdown";

import hello from "../lib/hello";

/*******************************************************************************
 * Private
 *******************************************************************************/

let random = (list) => list[Math.floor(Math.random() * list.length)];

let salutation = random(hello);

/*******************************************************************************
 * Public API
 *******************************************************************************/

export default () => (
  <Markdown className="content">
    ## TL;DR是什么
    {Cr}
    TL;DR 是 Too long; Didn't read的缩写。tldr 是社区维护的，用来简化
    [man手册](https://en.wikipedia.org/wiki/Man_page)的常用最佳实践。
    {Cr}
    ### 怎么用这个工具
    {Cr}
    看到Logo旁边的输入框了吗？只需输入一个命令，就能看到tldr查出的结果！
    {Cr}
    尝试 <code>osx/say</code>, <code>linux/du</code>, 或者简单的<code>man</code>命令
    {Cr}
    一些命令有通用的参数，但是还有一些命令每个操作系统都有所不同。
    目前 <code>tldr-pages</code> 项目将命令分为 4 类：common、linux、OSX 和 SunOS。
    {Cr}
    比如说<code>du</code>, 它只能在 <code>linux</code> 和 <code>osx</code>下使用
  </Markdown>
);
