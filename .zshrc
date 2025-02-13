source ~/.nvm/nvm.sh
nvmrc_path=".nvmrc"

if [[ -z "$NVM_DIR" ]]; then
    echo "please install nvm"
else
    # 网络情况有问题可以选择开启代理，需要启动 clashX 或其他代理软件，并设置端口 7890
    # export https_proxy=http://127.0.0.1:7890
    # export http_proxy=http://127.0.0.1:7890
    # export all_proxy=socks5://127.0.0.1:7890

    if [ -n "$nvmrc_path" ]; then
        nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
        if [ "$nvmrc_node_version" = "N/A" ]; then
            echo "Specified Node.js version not found, installing...."
            nvm install
        elif [ "$nvmrc_node_version" != "$(nvm version)" ]; then
            echo "Switching to specified Node.js version: $(cat "${nvmrc_path}")..."
            nvm use
        fi
    fi
fi