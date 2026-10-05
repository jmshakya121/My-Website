/* Shared helpers for turning a SOFTWARE_ITEMS entry into a runnable one-liner.
 *
 * These live here rather than inside DownloadHub so the command palette and the
 * terminal can build the exact same command string. Two copies of this logic
 * would drift, and a drifted `irm ... | iex` one-liner is a real footgun: it
 * pipes a remote script straight into an interpreter.
 */

export const SCRIPT_TYPES = ['.cmd', '.bat', '.sh', '.ps1']

export const nameOf = (item) => item.title || item.name || item.id

export const typeOf = (item) =>
  item.type ||
  (item.directUrl ? `.${item.directUrl.split('.').pop().toLowerCase()}` : '.bat')

export const fileUrlOf = (item) => item.directUrl || item.downloadUrl

/* Absolute URL, because the copied command is pasted into a *different* shell
   on a *different* machine — a relative path would resolve against the user's
   current directory and fail. */
export const absoluteFileUrl = (item) => `${window.location.origin}${fileUrlOf(item)}`

/* One-liner for power users to run the asset in PowerShell/CMD. */
export function commandFor(item) {
  const url = absoluteFileUrl(item)
  const file = fileUrlOf(item).split('/').pop()
  if (SCRIPT_TYPES.includes(typeOf(item))) {
    return `irm ${url} | iex`
  }
  return `iwr ${url} -OutFile "$env:USERPROFILE\\Downloads\\${file}"; explorer "$env:USERPROFILE\\Downloads\\${file}"`
}
