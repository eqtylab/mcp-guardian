# Installing - Windows
MCP Guardian consists of two main parts; the proxy and a user interface for configuration. There are two user interfaces provided; a CLI and a desktop gui. This doc will go through installing the gui, but you can do all the same configuration through the CLI.

## Download  

Download the the latest Windows zip package from [github](https://github.com/eqtylab/mcp-guardian/releases)

> You may need to show all assets to find the installer.  
![show all](./resources/show-all-assets.png)

## Extract
After the downloads complete, open the File Explorer and navigate to the download folder.  
1. Right click the zip file and select `Properties`  
![properties](./resources/zip-properties.png)

2. In the properties window that opens, check the `Unblock` checkbox on the General Tab in the Security section; and then click `Apply`.  
![unblock](./resources/msi-unblock.png)

3. Extract the zip file


## Install 

### Install - Proxy
* Rename `mcp-guardian-proxy_x86_64-windows.exe` to `mcp-guardian-proxy.exe`
* Move `mcp-guardian-proxy.exe` to you local appdata folder.  
> To find your appdata folder:  
> In PowerShell ```sh echo  $env:LOCALAPPDATA```  
> In command prompt ```sh echo %LOCALAPPDATA%```  


* Add the exe to your path to make it easier to call from anywhere on your system:  
1. Open the Start Menu and search for "Environment Variables" and select "Edit the system environment variables".  
![start menu](./resources/win-edit-env-var.png)
2. In the System Properties window, click on the "Environment Variables" button.  
![start menu](./resources/win-env-vars.png)
3. In the Environment Variables window, find the "Path" variable in the "System variables" section and select it, then click "Edit".
![start menu](./resources/win-new-env-var.png)
4. In the Edit Environment Variable window, click "New" and add `%USERPROFILE%\AppData\Local`  
![start menu](./resources/win-new-new-env-var.png)
5. Click `Apply` or `Ok` in each of those windows to close them 

* Open a PowerShell shell and run ```sh mcp-guardian-proxy --help``` and you should see output like this:  
![proxy cli](./resources/proxy-cli.png)

### Install - GUI

Double click the `mcp-guardian_x86_64-windows.msi` file to launch the installer.   
![installer](./resources/msi-installer.png)

Click the `Next` button, accepting all defaults, then click `Install`. You'll get a prompt from the User Account Control asking for permission to make changes to your device; select `Yes`  
![security](./resources/msi-user-account-control.png)

After the installer completes, click `Finish` and the MCP Guardian UI will launch automatically.


MCP Guardian is now installed. Check out the intro and tutorials to start using MCP Guardian with Claude Desktop.