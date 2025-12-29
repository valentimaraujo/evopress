#!/bin/bash

# Este script usa caminhos relativos ao diretório atual (raiz do evopress)
# Assumindo que o belflora está no mesmo nível do evopress no sistema de arquivos do WSL

PROJECT_ROOT="."
SOURCE_THEME="../belflora/lib/theme"
THEME_ASSETS="$PROJECT_ROOT/src/themes/gardyn/assets"
PUBLIC_THEME="$PROJECT_ROOT/public/themes/gardyn"

echo "📂 Criando estrutura de pastas no tema..."
mkdir -p "$THEME_ASSETS/css/colors"
mkdir -p "$THEME_ASSETS/js"
mkdir -p "$THEME_ASSETS/fonts"
mkdir -p "$THEME_ASSETS/images"

echo "🚚 Copiando arquivos do projeto Belflora para o tema Gardyn..."
# Verificando se a origem existe
if [ -d "$SOURCE_THEME" ]; then
    cp -v -r "$SOURCE_THEME/css/"* "$THEME_ASSETS/css/"
    cp -v -r "$SOURCE_THEME/js/"* "$THEME_ASSETS/js/"
    cp -v -r "$SOURCE_THEME/fonts/"* "$THEME_ASSETS/fonts/"
    cp -v -r "$SOURCE_THEME/images/"* "$THEME_ASSETS/images/"
else
    echo "❌ Erro: Não foi possível encontrar a pasta de origem em $SOURCE_THEME"
    echo "Dica: Verifique se a pasta ../belflora existe em relação ao diretório atual."
    exit 1
fi

echo "🌐 Sincronizando com a pasta public..."
mkdir -p "$PUBLIC_THEME"
cp -v -r "$THEME_ASSETS/"* "$PUBLIC_THEME/"

echo ""
echo "✅ Concluído com sucesso!"
echo "Os arquivos do tema estão agora em: $THEME_ASSETS"
