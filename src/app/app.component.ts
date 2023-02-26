import { Component } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private _snackBar: MatSnackBar) {}

  title = 'jetbrains.alexishayat.me';
  jbApp = {
    name: null,
    directoryName: null,
    executable: null
  };
  basePath = '';
  buildVersion = '';
  code = '';
  is64bits = false;
  list = [
    {
      name: 'PHPStorm',
      directoryName: 'PhpStorm',
      executable: 'phpstorm',
      logo: 'phpstorm'
    },
    {
      name: 'DataGrip',
      directoryName: 'datagrip',
      executable: 'datagrip',
      logo: 'datagrip'
    },
    {
      name: 'GoLand',
      directoryName: 'Goland',
      executable: 'goland',
      logo: 'goland'
    },
    {
      name: 'PyCharm Professional',
      directoryName: 'PyCharm-P',
      executable: 'pycharm',
      logo: 'pycharm'
    },
    {
      name: 'PyCharm Community',
      directoryName: 'PyCharm-C',
      executable: 'pycharm',
      logo: 'pycharm-ce'
    },
    {
      name: 'Rider',
      directoryName: 'Rider',
      executable: 'rider',
      logo: 'rider'
    },
    {
      name: 'WebStorm',
      directoryName: 'WebStorm',
      executable: 'webstorm',
      logo: 'webstorm'
    },
    {
      name: 'IntelliJ',
      directoryName: 'IDEA-U',
      executable: 'idea',
      logo: 'intellij-idea'
    },
    {
      name: 'DataSpell',
      directoryName: 'DataSpell',
      executable: 'dataspell',
      logo: 'dataspell'
    },
    {
      name: 'CLion',
      directoryName: 'CLion',
      executable: 'clion',
      logo: 'clion'
    },
    {
      name: 'RubyMine',
      directoryName: 'RubyMine',
      executable: 'rubymine',
      logo: 'rubymine'
    },
    {
      name: 'Android Studio',
      directoryName: 'AndroidStudio',
      executable: 'studio',
      logo: 'android-studio'
    },
  ];
  listInputPath = this.getCookie('input_bas_path_history')?.split('/').filter(el => el.length > 0) || [];
  async getGeneratedCode() {
    if (!this.jbApp || !this.basePath || !this.buildVersion) {
      this._snackBar.open('You have to fill each inputs', undefined, { duration: 3000 });
      return;
    }

    let fullPath = this.basePath + 'JetBrains\\apps\\'
      + this.jbApp.directoryName + '\\ch-0\\' + this.buildVersion + '\\bin\\' + this.jbApp.executable
      + (this.is64bits ? '64' : '') + '.exe';
    fullPath = fullPath.replaceAll('\\', '\\\\')

    if (!this.listInputPath?.includes(this.basePath)) {
      this.listInputPath?.push(this.basePath);
      this.setCookie('input_bas_path_history', this.listInputPath?.join('/') || '', 30)
    }


    const actionFullName = `Edit with ${this.jbApp.name}`;
    const actionFolderFullName = `Open folder as ${this.jbApp.name} project`;

    const lines = [
      ` Windows Registry Editor Version 5.00`,
      ` ; Open files`,
      ` [HKEY_CLASSES_ROOT\\*\\shell\\${actionFullName}]`,
      ` @="${actionFullName}"`,
      ` "Icon"="${fullPath},0"`,
      ` [HKEY_CLASSES_ROOT\\*\\shell\\${actionFullName}\\command]`,
      ` @="\\"${fullPath}\\" \\"%1\\""`,
      ` ; This will appear when you right click on a folder`,
      ` [HKEY_CLASSES_ROOT\\Directory\\shell\\${this.jbApp.name}]`,
      ` @="${actionFolderFullName}"`,
      ` "Icon"="\\"${fullPath}\\",0"`,
      ` [HKEY_CLASSES_ROOT\\Directory\\shell\\${this.jbApp.name}\\command]`,
      ` @="\\"${fullPath}\\" \\"%1\\""`,
      ` ; This will appear when you right click inside a folder`,
      ` [HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\${this.jbApp.name}]`,
      ` @="${actionFolderFullName}"`,
      ` "Icon"="\\"${fullPath}\\",0"`,
      ` [HKEY_CLASSES_ROOT\\Directory\\Background\\shell\\${this.jbApp.name}\\command]`,
      ` @="\\"${fullPath}\\" \\"%V\\""\n`
    ];

    this.code = lines.join('\n');
  };
  async copyCode() {
    try {
      await navigator.clipboard.writeText(this.code);
      this._snackBar.open('The code has been copied!', undefined, { duration: 3000 });
    } catch ($e) {
      this._snackBar.open('Something went wrong!', undefined, { duration: 3000 });
    }
  };
  downloadFile() {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.code));
    element.setAttribute('download', `${this.jbApp.name}-${this.buildVersion}.reg`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };
  getCookie(name: string) {
    // Split cookie string and get all individual name=value pairs in an array
    const cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for(let i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].split("=");

      /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
      if(name == cookiePair[0].trim()) {
        // Decode the cookie value and return
        return decodeURIComponent(cookiePair[1]);
      }
    }

    // Return null if not found
    return null;
  };
  setCookie(name: string, value: string | number | boolean, daysToLive: number) {
    // Encode value in order to escape semicolons, commas, and whitespace
    let cookie = name + "=" + encodeURIComponent(value);

    /* Sets the max-age attribute so that the cookie expires
     after the specified number of days */
    cookie += "; max-age=" + (daysToLive * 24 * 60 * 60);
    document.cookie = cookie;
  };
}
