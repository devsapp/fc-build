> 注一：--custom-args、--custom-env、 --command 和 --script-file 这些参数是不支持本地环境，仅仅在 kaniko 和 buildkit 本地环境下才支持

## Kaniko

### 使用 Kaniko

- 环境变量 `BUILD_IMAGE_ENV === fc-backend` 。
  > 如果 custom-container 函数，则根据 dockerfile 使用 kaniko 编译；其他的 runtime 则强制使用本地环境编译。

### 对参数影响

用户指定的 `--use-sandbox`、`--use-docker`、`--use-buildkit` 均不生效。

<!-- custom-container 函数不支持 --custom-args、--custom-env、 --command 和 --script-file 参数。 -->

其他的 runtime 支持 --custom-args、 --command 和 --script-file 参数。

### 代码输出目录

- 如果指定了 --command 和 --script-file 参数，输出目录为用户指定的 codeuri 目录。
- 如果没有指定 --command 和 --script-file 参数，输出目录和本地环境行为一致。

## Buildkit

### 使用 Buildkit

- Buildkit 的逻辑判断是用户手动指定 --use-buildkit
- 环境变量 `enableBuildkitServer=1` 和 buildkitServerPort 是数字类型（云效的 Serverless Devs 默认带有环境变量 enableBuildkitServer=1 和 buildkitServerPort=65360）
  > 如果 custom-container 函数，则根据 dockerfile 使用 buildkit 编译；其他的 runtime 则强制使用本地环境编译。

### 对参数影响

用户指定的 `--use-sandbox`、`--use-docker` 均不生效。

支持 --custom-args、--custom-env、 --command 和 --script-file 参数

### 代码输出目录

- 如果指定了 --command、--script-file：用户指定的 codeuri 目录
- 其他：和 yaml 同级目录的 .s/build/artifacts/{serviceName}/{functionName}

## Sandbox

### 使用 Sandbox

使用 `--use-sandbox` 使用此模式。

### 对参数影响

用户指定的 `--custom-args`、`--command`、`--script-file`、`--use-docker` 不生效。

仅支持 --custom-env 参数。

### 代码输出目录

用户指定的 codeuri 目录

## Docker

### 使用 Docker

- 使用 --use-docker
- 指定了 --command、--script-file

### 代码输出目录

- 如果指定了 --command、--script-file：用户指定的 codeuri 目录
- 其他：和 yaml 同级目录的 .s/build/artifacts/{serviceName}/{functionName}

## 本地环境

> 不推荐使用，推荐直接使用命令安装依赖

### 使用本地环境

不指定 `--use-*`、`--command`、`--script-file`。

### 对参数影响

不支持任何的参数。

### 代码输出目录

非 custom-container 函数代码挂载输出目录：和 yaml 同级目录的 .s/build/artifacts/{serviceName}/{functionName}
