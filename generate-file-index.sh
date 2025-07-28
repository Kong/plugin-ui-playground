#!/bin/bash

# 设置工作目录
WORKSPACE_DIR="$(pwd)"
SCHEMA_DIR="${WORKSPACE_DIR}/gateway-schema-watcher"
OUTPUT_FILE="${WORKSPACE_DIR}/src/file-index.ts"

# 确保输出目录存在
mkdir -p "$(dirname "${OUTPUT_FILE}")"

# 开始生成文件
echo "// 此文件由脚本自动生成，请勿手动修改" > "${OUTPUT_FILE}"
echo "// Generated on $(date)" >> "${OUTPUT_FILE}"
echo "export default [" >> "${OUTPUT_FILE}"

# 处理 examples 目录
EXAMPLES_DIR="${WORKSPACE_DIR}/examples"

# 查找 examples 目录下的所有子目录并处理
find "${EXAMPLES_DIR}" -mindepth 1 -maxdepth 1 -type d | sort | while read -r example_dir; do
    dir_name=$(basename "${example_dir}")
    echo "  {" >> "${OUTPUT_FILE}"
    echo "    label: '${dir_name}/'," >> "${OUTPUT_FILE}"
    echo "    children: [" >> "${OUTPUT_FILE}"

    # 查找该子目录下的所有 json 文件并排序
    find "${example_dir}" -name "*.json" -type f | sort | while read -r file; do
        filename=$(basename "${file}")
        echo "      { label: '${filename}' }," >> "${OUTPUT_FILE}"
    done

    # 结束这个例子的部分
    echo "    ]" >> "${OUTPUT_FILE}"
    echo "  }," >> "${OUTPUT_FILE}"
done

# 处理 plugins 目录
echo "  {" >> "${OUTPUT_FILE}"
echo "    label: 'plugins/'," >> "${OUTPUT_FILE}"
echo "    children: [" >> "${OUTPUT_FILE}"

# 查找所有 plugins 目录下的 json 文件并排序
find "${SCHEMA_DIR}/plugins" -name "*.json" -type f | sort | while read -r file; do
    filename=$(basename "${file}")
    echo "      { label: '${filename}' }," >> "${OUTPUT_FILE}"
done

# 结束 plugins 部分
echo "    ]" >> "${OUTPUT_FILE}"
echo "  }," >> "${OUTPUT_FILE}"

# # 处理 non-plugin-entities 目录
# echo "  {" >> "${OUTPUT_FILE}"
# echo "    label: 'non-plugin-entities/'," >> "${OUTPUT_FILE}"
# echo "    children: [" >> "${OUTPUT_FILE}"

# # 查找所有 non-plugin-entities 目录下的 json 文件并排序
# find "${SCHEMA_DIR}/non-plugin-entities" -name "*.json" -type f | sort | while read -r file; do
#     filename=$(basename "${file}")
#     echo "      { label: '${filename}' }," >> "${OUTPUT_FILE}"
# done

# # 结束 non-plugin-entities 部分
# echo "    ]" >> "${OUTPUT_FILE}"
# echo "  }" >> "${OUTPUT_FILE}"



# 结束文件
echo "]" >> "${OUTPUT_FILE}"

# 设置脚本为可执行
chmod +x "${0}"

echo "文件 ${OUTPUT_FILE} 已生成完成"
