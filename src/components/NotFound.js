//@flow

/*******************************************************************************
 * Imports
 *******************************************************************************/

import React from "react";

import { Markdown, Cr } from "tldr/components/Markdown";
import Link from "tldr/components/Link";
import Tldr from "tldr/components/Tldr";

/*******************************************************************************
 * Public API
 *******************************************************************************/

export default () => (
  <Markdown className="content">
    ## 啊欧，命令没找到
    {Cr}
    我们找了又找，但还是没有找到。也许你能帮我们找到它？
    {Cr}
    <Tldr size="small" /> 是社区的努力, 我们需要你这样的人来提高标准，帮我们找到那些缺失的命令。
    {Cr}
    ### 我要怎么帮助社区呢？
    {Cr}
    看看
    <Link
      href="https://github.com/tldr-pages/tldr/issues?q=is%3Aissue+is%3Aopen+label%3A%22new+command%22"
      text="Command Requests"
    />{" "}
    ，向社区抛出问题，或者打开一个
    <Link
      href="https://github.com/tldr-pages/tldr/pulls"
      text="command proposals"
    />提供修改建议。
    .{Cr}
    如果您想要的命令还没有被收录，鼓励自己提交一个建议！ 😉 &mdash;{" "}
    <Link
      href="https://github.com/tldr-pages/tldr/blob/master/CONTRIBUTING.md"
      text="Start here"
    />
    {Cr}
  </Markdown>
);
