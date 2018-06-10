###
### ReasonML toolchain setup
###

load("//3rdparty/repos:utils.bzl", "new_download")
load("@io_tweag_rules_nixpkgs//nixpkgs:nixpkgs.bzl", "nixpkgs_package")

BUILD_FILE="""
package(default_visibility = ["//visibility:public"])

filegroup(
  name = "bin",
  srcs = glob(["*/bin/*"]),
)
"""

REASON_BUILD_FILE="""
filegroup(
    name = "bin",
    srcs = glob([ "**/bin/*" ]),
    )

genrule(
  visibility = ["//visibility:public"],
  name = "unpack_binaries",
  cmd = \"\"\"\
  #!/bin/bash

  # Copy binaries to the output location
  cp external/reason/bin/* $$(dirname $(location :refmt));

  \"\"\",
  srcs = [ ":bin" ],
  outs = [
        "menhir_error_processor",
        "reactjs_jsx_ppx_v2",
        "refmt",
        "rtop_init.ml",
        "ocamlmerlin-reason",
        "reactjs_jsx_ppx_v3",
        "refmttype",
        "testOprint",
        "ppx_react",
        "rebuild",
        "rtop",
      ]
  )
"""

def reasonml_repositories():
  nixpkgs_package(
      name = "ocaml",
      attribute_path = "ocaml_4_02",
      # TODO(@ostera): use a build_file that exports individual binaries
      build_file_content = BUILD_FILE
      )

  nixpkgs_package(
      name = "reason",
      attribute_path = "ocamlPackages.reason",
      build_file_content = REASON_BUILD_FILE
      )

  new_download(
    pkg = "bs",
    org = "BuckleScript",
    repo = "bucklescript",
    sha256 = "8a1c9fa6f6385708b5cc6fe162a6db2b971ee5ebbe2614e3a1062b6f25d8be27",
    version = "2ae5ef1ebb94466f7e0e52d21efa337af4b1dba4",
    ext = "zip",
    build_file = "3rdparty/repos/BUILD.bucklescript",
    )
