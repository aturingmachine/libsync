function getCliArg(argv: string[], key: string): string {
  const possibleMatches = argv.filter((arg) => arg.includes(key)).reverse()
  const finalArg = possibleMatches[0]

  if (finalArg?.includes('=')) {
    return finalArg.split('=')[1]
  }
  return finalArg
}

export { getCliArg }
