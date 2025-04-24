{
  echo "現在のTRPCを使ったフルスタックのプロジェクトですが、詳しく解説してもらえませんか？"
  echo "# 📁 プロジェクト構成 (tree)"
  echo '```'
  tree ./client/app ./server/src -I node_modules
  echo '```'

  echo -e "\n# 📄 ファイルの中身"

  files=(
    "./client/app/routes/_index.tsx"
    "./client/app/routes/fruits.\$id.tsx"
    "./client/app/lib/trpc.ts"
    "./client/app/lib/trpc.server.ts"
    "./client/app/root.tsx"
    "./server/src/index.ts"
    "./server/src/trpc/index.ts"
    "./server/src/trpc/context.ts"
    "./server/src/models/fruit.ts"
  )

  for file in "${files[@]}"; do
    echo -e "\n---\n### $file\n\`\`\`ts"
    cat "$file"
    echo -e "\n\`\`\`"
  done
} > summary.md
