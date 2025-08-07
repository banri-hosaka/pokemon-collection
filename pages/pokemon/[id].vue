<template>
  <div v-if="pokemon">
    <!-- 戻るボタン -->
    <UButton
      icon="i-heroicons-arrow-left-20-solid"
      color="gray"
      variant="ghost"
      class="mb-6"
      @click="router.back()"
    >
      戻る
    </UButton>

    <!-- ポケモンヘッダー -->
    <UCard class="mb-6">
      <div class="flex items-center gap-6">
        <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
          <img 
            :src="pokemon.sprites.front_default" 
            :alt="pokemon.japaneseName"
            class="w-24 h-24"
          />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">{{ pokemon.japaneseName }}</h1>
          <p class="text-lg text-gray-600 mt-1">
            No.{{ pokemon.id.toString().padStart(3, "0") }}
          </p>
          <div class="flex gap-2 mt-3">
            <UBadge
              v-for="type in pokemon.types"
              :key="type.slot"
              :color="getTypeColor(type.type.name)"
              variant="solid"
              size="md"
            >
              {{ translateType(type.type.name) }}
            </UBadge>
          </div>
        </div>
      </div>
    </UCard>

    <!-- タブ -->
    <UTabs v-model="activeTab" class="mb-6">
      <UTab name="info" label="詳細情報" />
      <UTab name="collection" label="コレクション" />
    </UTabs>

    <!-- 詳細情報タブ -->
    <div v-if="activeTab === 'info'">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">ステータス</h3>
        </template>
        
        <div class="space-y-4">
          <div
            v-for="stat in pokemon.stats"
            :key="stat.stat.name"
            class="flex items-center gap-4"
          >
            <div class="w-24 text-sm font-medium text-gray-700">
              {{ translateStat(stat.stat.name) }}
            </div>
            <div class="flex-1">
              <UProgress 
                :value="stat.base_stat" 
                :max="255"
                color="primary"
                size="md"
              />
            </div>
            <div class="w-12 text-right text-sm font-semibold">
              {{ stat.base_stat }}
            </div>
          </div>
        </div>
      </UCard>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <UCard>
          <div class="text-center">
            <h4 class="text-sm font-medium text-gray-600 mb-1">たかさ</h4>
            <p class="text-xl font-bold">{{ (pokemon.height / 10).toFixed(1) }}m</p>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <h4 class="text-sm font-medium text-gray-600 mb-1">おもさ</h4>
            <p class="text-xl font-bold">{{ (pokemon.weight / 10).toFixed(1) }}kg</p>
          </div>
        </UCard>
      </div>
    </div>

    <!-- コレクションタブ -->
    <div v-else-if="activeTab === 'collection'">
      <UCard v-if="isInCollection">
        <template #header>
          <h3 class="text-lg font-semibold">コレクション情報</h3>
        </template>
        
        <div class="space-y-4">
          <UFormGroup label="ニックネーム">
            <UInput
              v-model="collectionData.nickname"
              placeholder="ニックネームを入力"
              size="md"
            />
          </UFormGroup>

          <UFormGroup label="メモ">
            <UTextarea
              v-model="collectionData.memo"
              placeholder="メモを入力"
              :rows="4"
              size="md"
            />
          </UFormGroup>

          <UCheckbox
            v-model="collectionData.isFavorite"
            label="お気に入りに登録"
          />

          <div class="flex gap-3 pt-4">
            <UButton
              color="primary"
              size="md"
              @click="updateCollection"
            >
              保存
            </UButton>
            <UButton
              color="red"
              variant="soft"
              size="md"
              @click="removeFromCollection"
            >
              コレクションから削除
            </UButton>
          </div>
        </div>
      </UCard>

      <UCard v-else>
        <div class="text-center py-8">
          <p class="text-gray-600 mb-4">
            このポケモンはまだコレクションに追加されていません。
          </p>
          <UButton
            color="primary"
            size="lg"
            icon="i-heroicons-plus-20-solid"
            @click="addToCollection"
          >
            コレクションに追加
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- ステータスメッセージ -->
    <UNotification
      v-if="statusMessage"
      :title="statusMessage"
      :color="messageType === 'success' ? 'green' : 'red'"
      :icon="messageType === 'success' ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
      class="fixed bottom-4 right-4 z-50"
    />
  </div>

  <!-- エラー表示 -->
  <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[50vh]">
    <UCard class="max-w-md w-full">
      <div class="text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 text-4xl mb-4" />
        <h2 class="text-xl font-semibold mb-2">エラーが発生しました</h2>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <UButton
          color="primary"
          @click="router.push('/')"
        >
          トップページに戻る
        </UButton>
      </div>
    </UCard>
  </div>

  <!-- ローディング -->
  <div v-else class="flex items-center justify-center min-h-[50vh]">
    <div class="text-center">
      <UIcon name="i-heroicons-arrow-path-20-solid" class="animate-spin h-12 w-12 text-primary mb-4" />
      <p class="text-gray-600">読み込み中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const pokemon = ref(null);
const error = ref(null);
const activeTab = ref("info");
const isInCollection = ref(false);
const collectionData = ref({
  id: null,
  nickname: "",
  memo: "",
  isFavorite: false,
});
const statusMessage = ref("");
const messageType = ref("success");

// ライフサイクルフック：マウント時
onMounted(async () => {
  console.log("ポケモン詳細ページがマウントされました");
  await fetchPokemonData();
  await checkCollectionStatus();
});

// routeのIDが変更された時に再取得
watch(
  () => route.params.id,
  async () => {
    await fetchPokemonData();
    await checkCollectionStatus();
  }
);

// ポケモンデータの取得
async function fetchPokemonData() {
  const id = route.params.id;
  try {
    const response = await fetch(`/api/pokemon/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("ポケモンが見つかりませんでした");
      }
      throw new Error("データの取得に失敗しました");
    }
    pokemon.value = await response.json();
  } catch (err) {
    error.value = err.message;
    console.error("ポケモンデータ取得エラー:", err);
  }
}

// コレクションステータスの確認
async function checkCollectionStatus() {
  if (!pokemon.value) return;

  try {
    const userId = 1; // 開発用の仮ユーザーID
    const response = await fetch(`/api/collection?userId=${userId}`);
    if (!response.ok) throw new Error("コレクションデータの取得に失敗しました");

    const collection = await response.json();
    const foundPokemon = collection.find(
      (item) => item.pokemonId === pokemon.value.id
    );

    if (foundPokemon) {
      isInCollection.value = true;
      collectionData.value = {
        id: foundPokemon.id,
        nickname: foundPokemon.nickname || "",
        memo: foundPokemon.memo || "",
        isFavorite: foundPokemon.isFavorite,
      };
    } else {
      isInCollection.value = false;
      collectionData.value = {
        id: null,
        nickname: "",
        memo: "",
        isFavorite: false,
      };
    }
  } catch (err) {
    console.error("コレクションステータス確認エラー:", err);
  }
}

// コレクションに追加
async function addToCollection() {
  try {
    const response = await fetch("/api/collection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pokemonId: pokemon.value.id,
        userId: 1, // 開発用の仮ユーザーID
        nickname: "",
        memo: "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "コレクションへの追加に失敗しました"
      );
    }

    const data = await response.json();
    collectionData.value = {
      id: data.id,
      nickname: data.nickname || "",
      memo: data.memo || "",
      isFavorite: data.isFavorite,
    };
    isInCollection.value = true;

    showStatusMessage("コレクションに追加しました", "success");
  } catch (err) {
    showStatusMessage(err.message, "error");
    console.error("コレクション追加エラー:", err);
  }
}

// コレクション情報の更新
async function updateCollection() {
  try {
    const response = await fetch(`/api/collection/${collectionData.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: collectionData.value.nickname,
        memo: collectionData.value.memo,
        isFavorite: collectionData.value.isFavorite,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "更新に失敗しました");
    }

    showStatusMessage("情報を更新しました", "success");
  } catch (err) {
    showStatusMessage(err.message, "error");
    console.error("コレクション更新エラー:", err);
  }
}

// コレクションから削除
async function removeFromCollection() {
  if (!confirm("本当にコレクションから削除しますか？")) return;

  try {
    const response = await fetch(`/api/collection/${collectionData.value.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "削除に失敗しました");
    }

    isInCollection.value = false;
    collectionData.value = {
      id: null,
      nickname: "",
      memo: "",
      isFavorite: false,
    };

    showStatusMessage("コレクションから削除しました", "success");
  } catch (err) {
    showStatusMessage(err.message, "error");
    console.error("コレクション削除エラー:", err);
  }
}

// ステータスメッセージの表示
function showStatusMessage(message, type) {
  statusMessage.value = message;
  messageType.value = type;

  setTimeout(() => {
    statusMessage.value = "";
  }, 3000);
}

// タイプ名の日本語変換
function translateType(type) {
  const typeMap = {
    normal: "ノーマル",
    fire: "ほのお",
    water: "みず",
    electric: "でんき",
    grass: "くさ",
    ice: "こおり",
    fighting: "かくとう",
    poison: "どく",
    ground: "じめん",
    flying: "ひこう",
    psychic: "エスパー",
    bug: "むし",
    rock: "いわ",
    ghost: "ゴースト",
    dragon: "ドラゴン",
    dark: "あく",
    steel: "はがね",
    fairy: "フェアリー",
  };
  return typeMap[type] || type;
}

// タイプごとのカラー設定（Nuxt UI用）
function getTypeColor(type) {
  const colorMap = {
    normal: 'gray',
    fire: 'red',
    water: 'blue',
    electric: 'yellow',
    grass: 'green',
    ice: 'cyan',
    fighting: 'orange',
    poison: 'purple',
    ground: 'amber',
    flying: 'sky',
    psychic: 'pink',
    bug: 'lime',
    rock: 'stone',
    ghost: 'violet',
    dragon: 'indigo',
    dark: 'slate',
    steel: 'zinc',
    fairy: 'rose',
  };
  return colorMap[type] || 'gray';
}

// ステータス名の日本語変換
function translateStat(stat) {
  const statMap = {
    hp: "HP",
    attack: "こうげき",
    defense: "ぼうぎょ",
    "special-attack": "とくこう",
    "special-defense": "とくぼう",
    speed: "すばやさ",
  };
  return statMap[stat] || stat;
}
</script>
