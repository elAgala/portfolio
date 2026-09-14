#!/bin/sh
set -eu

repository=ghcr.io/elagala/portfolio
source_sha=${CI_COMMIT_SHA:-}
output_file=${RELEASE_IMAGE_FILE:-.release/image.txt}
crane_bin=${CRANE_BIN:-crane}

case "$source_sha" in
  *[!0-9a-f]*|'')
    printf '%s\n' 'CI_COMMIT_SHA must be a full lowercase hexadecimal commit SHA' >&2
    exit 1
    ;;
esac
[ "${#source_sha}" -eq 40 ] || {
  printf '%s\n' 'CI_COMMIT_SHA must be exactly 40 characters' >&2
  exit 1
}

tagged_image="$repository:$source_sha"
digest=$("$crane_bin" digest "$tagged_image")
case "$digest" in
  sha256:????????????????????????????????????????????????????????????????) ;;
  *)
    printf '%s\n' 'registry did not return an exact sha256 image digest' >&2
    exit 1
    ;;
esac

case "${digest#sha256:}" in
  *[!0-9a-f]*)
    printf '%s\n' 'registry returned a non-hexadecimal image digest' >&2
    exit 1
    ;;
esac

config=$("$crane_bin" config "$repository@$digest")
expected_label="\"org.opencontainers.image.revision\":\"$source_sha\""
case "$config" in
  *"$expected_label"*) ;;
  *)
    printf '%s\n' 'image revision label does not match the deployment commit' >&2
    exit 1
    ;;
esac

mkdir -p "$(dirname "$output_file")"
umask 077
printf '%s@%s\n' "$repository" "$digest" > "$output_file"
[ "$(wc -l < "$output_file")" -eq 1 ]
