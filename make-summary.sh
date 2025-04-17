{
  echo "# 📁 プロジェクト構成 (tree)"
  echo '```'
  tree ./client/app ./server/src -I node_modules
  echo '```'

  echo -e "\n# 📄 ファイル中身"

  find ./client/app ./server/src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" \) \
    -exec echo -e "\n---\n### {}\n\`\`\`ts" \; \
    -exec cat {} \; \
    -exec echo -e "\n\`\`\`" \;
} > summary.md
