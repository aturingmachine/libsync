import fs from 'fs'
import EnvConfig from './config/env-config/env-config.js'

export class FileSystemHelper {
  private static readonly filename = 'libsync_test_filename'

  static checkFSCaseSensitivity(): void {
    fs.writeFileSync(FileSystemHelper.filename, 'libsync_fs_check')

    try {
      fs.copyFileSync(
        FileSystemHelper.filename,
        FileSystemHelper.filename.toUpperCase(),
        fs.constants.COPYFILE_EXCL
      )

      EnvConfig.caseSensitiveFs = true
      fs.rmSync(FileSystemHelper.filename.toUpperCase())
    } catch (error) {
      if (error.code === 'EEXIST') {
        EnvConfig.caseSensitiveFs = true
      }
    }

    fs.rmSync(FileSystemHelper.filename)
  }
}
