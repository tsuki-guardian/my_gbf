<template>
  <div class="gacha-parse">
    <el-card class="input-card">
      <template #header>
        <div class="card-header">
          <span>資料注入區</span>
        </div>
      </template>
      <div class="input-area">
        <el-input
          v-model="inputData"
          type="textarea"
          :rows="10"
          placeholder="請在此處貼上卡池資料..."
          clearable
        />
        <div class="action-buttons">
          <el-button type="primary" @click="handleParse">
            執行解析
          </el-button>
          <el-button @click="handleClear">
            清空
          </el-button>
          <el-button type="info" class="ml_auto" @click="copyToolCode">
            卡池擷取工具
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="result-card">
      <template #header>
        <div class="card-header">
          <span>分析結果</span>
        </div>
      </template>
      <div class="result-content">
        <!-- 這裡預留給後續的資料顯示 -->
        <el-empty v-if="!isParsed" description="尚無資料" />
        <div v-else>
          <!-- 可以在這裡添加顯示邏輯 -->
          <div>
						<h2>{{ gachaData.gachaName }}</h2>
					</div>
          <div class="items-section">
						<h3>角色</h3>
						<el-row :gutter="12">
							<el-col :span="4" v-for="(character, index) in gachaData.Characters" :key="character.name">
								<div
									class="item-wrapper"
									:class="{ 'selected': character.selected }"
									@click="toggleCharacterSelect(index)"
								>
                  <p v-if="!character?.characterId" class="unknown-name">{{ character.name }}</p>
									<el-image :src="character.imageURL" alt="" fit="cover" />
									<div class="mask" v-if="!character.selected"></div>
									<div class="rate-badge" :class="{ 'pickup': character.pickup }">{{ character.rate }}%</div>
								</div>
							</el-col>
						</el-row>
					</div>
          <div class="items-section">
						<h3>召喚石</h3>
						<el-row :gutter="12">
							<el-col :span="4" v-for="(summon, index) in gachaData.Summons" :key="summon.name">
								<div
									class="item-wrapper"
									:class="{ 'selected': summon.selected }"
									@click="toggleSummonSelect(index)"
								>
                  <p v-if="!summon?.id" class="unknown-name">{{ summon.name }}</p>
									<el-image :src="summon.imageURL" alt="" fit="cover" />
									<div class="mask" v-if="!summon.selected"></div>
									<div class="rate-badge" :class="{ 'pickup': summon.pickup }">{{ summon.rate }}%</div>
								</div>
							</el-col>
						</el-row>
					</div>

					<!-- 機率計算區 -->
					<el-divider />
					<div class="probability-section">
						<h3>機率計算</h3>
						<div class="probability-stats">
							<el-statistic title="已選擇項目" :value="selectedCount" />
							<el-statistic title="總機率" :value="totalProbability" suffix="%" :precision="2" />
						</div>
					</div>

					<!-- 模擬抽卡區 -->
					<el-divider />
					<div class="gacha-simulation">
						<h3>模擬抽卡</h3>
						<el-button type="primary" size="large" @click="simulateGacha">
							抽一次必得轉蛋!
						</el-button>

						<div v-if="gachaResult" class="gacha-result">
							<h4>抽卡結果</h4>
							<div class="result-item">
								<el-image
									:src="gachaResult.imageURL"
									alt=""
									fit="cover"
									style="width: 200px; border-radius: 8px;"
								/>
								<div class="result-info">
									<p class="result-name">{{ gachaResult.name }}</p>
									<p class="result-type">{{ gachaResult.type }}</p>
									<p class="result-rate">機率: {{ gachaResult.rate }}%</p>
								</div>
							</div>
						</div>
					</div>
        </div>
      </div>
    </el-card>

    <!-- 回到頂部按鈕 -->
    <el-backtop target=".content-container" :right="40" :bottom="40" :visibility-height="200" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import characterJson from '../../json/character.json'
import summonsJson from '../../json/summons.json'
import toolCode from '../../tool/mini_dataPicker.js?raw'

// 輸入的原始資料
const inputData = ref('')
const isParsed = ref(false)

// 資料庫
const characterDatabase = ref<any>(characterJson)
const summonDatabase = ref<any>(summonsJson)

// 靜態導入圖片資源
import fireImg from '@/images/ssr_fire.jpg'
import waterImg from '@/images/ssr_water.jpg'
import earthImg from '@/images/ssr_earth.jpg'
import windImg from '@/images/ssr_wind.jpg'
import lightImg from '@/images/ssr_light.jpg'
import darkImg from '@/images/ssr_dark.jpg'
import unknownImg from '@/images/unknow.jpg'

// 未知角色圖片
const getLocalAttributeImg = (attribute: string) => {
  switch (attribute) {
    case '火':
      return fireImg
    case '水':
      return waterImg
    case '土':
      return earthImg
    case '風':
      return windImg
    case '光':
      return lightImg
    case '闇':
      return darkImg
    default:
      return unknownImg
  }
}
// 卡池資料
const gachaData = ref<any>({
	gachaName: '',
	Characters: [] as any[],
	Summons: [] as any[],
	normalWeapons: [] as any[],
})

// 抽卡結果
const gachaResult = ref<any>(null)

// 切換角色選中狀態
const toggleCharacterSelect = (index: number) => {
	gachaData.value.Characters[index].selected = !gachaData.value.Characters[index].selected
}

// 切換召喚石選中狀態
const toggleSummonSelect = (index: number) => {
	gachaData.value.Summons[index].selected = !gachaData.value.Summons[index].selected
}

// 計算已選擇項目數量
const selectedCount = computed(() => {
	const characterCount = gachaData.value.Characters.filter((item: any) => item.selected).length
	const summonCount = gachaData.value.Summons.filter((item: any) => item.selected).length
	return characterCount + summonCount
})

// 計算總機率（先相加後四捨五入至小數第2位）
const totalProbability = computed(() => {
	const characterRate = gachaData.value.Characters
		.filter((item: any) => item.selected)
		.reduce((sum: number, item: any) => sum + item.rate, 0)

	const summonRate = gachaData.value.Summons
		.filter((item: any) => item.selected)
		.reduce((sum: number, item: any) => sum + item.rate, 0)

	const total = characterRate + summonRate
	// 四捨五入至小數第2位
	return Math.round(total * 100) / 100
})

// 處理解析
const handleParse = () => {
  if (!inputData.value.trim()) {
		return
  }
	isParsed.value = false
	gachaData.value = {
		gachaName: '',
		Characters: [],
		Summons: [],
		normalWeapons: [],
	}

	try {
		const parsedData = JSON.parse(inputData.value) as any
		// 卡池名稱
		gachaData.value.gachaName = parsedData.gachaName
		// 角色
		parsedData.Characters.forEach((character: any) => {
			const chara = characterDatabase.value.find((item: any) => item.unlockWeapon === character.weaponName)
			if (chara) {
				if(chara.rare === 'SSR') {
					gachaData.value.Characters.push({
						...chara,
						rate: parseFloat(character.rate.replace('%', '')),
						imageURL: `https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/assets/npc/m/304${chara.characterId}000_01.jpg`,
						selected: false, // 初始化為未選中
						pickup: character.pickup || false, // pickup 標記
					})
				}
			} else {
				if(character.rare === 'SSR') {
					gachaData.value.Characters.push({
						name: character.charName,
						unlockWeapon: character.weaponName,
						rare: character.rare,
						rate: parseFloat(character.rate.replace('%', '')),
						imageURL: getLocalAttributeImg(character.attribute),
						attribute: character.attribute,
						selected: false, // 初始化為未選中
						pickup: character.pickup || false, // pickup 標記
					})
				}
				ElMessage.error(`角色 ${character.charName}(${character.weaponName}) 尚未定義`)
			}
		})
		// 召喚石
		parsedData.Summons.forEach((summon: any) => {
			const summonData = summonDatabase.value.find((item: any) => item.name === summon.name)
			if (summonData) {
				gachaData.value.Summons.push({
					...summonData,
					rate: parseFloat(summon.rate.replace('%', '')),
					imageURL: `https://prd-game-a1-granbluefantasy.akamaized.net/assets/img/sp/assets/summon/m/204${summonData.id}000.jpg`,
					selected: false, // 初始化為未選中
					pickup: summon.pickup || false, // pickup 標記
				})
			} else if (summon.rare === 'SSR') {
				// SSR 找不到才顯示錯誤（可能是名稱不符）
				gachaData.value.Summons.push({
					name: summon.name,
					rate: parseFloat(summon.rate.replace('%', '')),
					imageURL: getLocalAttributeImg(summon.attribute),
					selected: false, // 初始化為未選中
					pickup: summon.pickup || false, // pickup 標記
				})
				ElMessage.error(`召喚石 ${summon.name} 尚未定義`)
			}
			// R/SR 找不到則忽略（資料庫只有 SSR）
		})

		isParsed.value = true
	} catch (error) {
		ElMessage.error('資料格式錯誤')
		return
	}
}

// 清空資料
const handleClear = () => {
  inputData.value = ''
	isParsed.value = false
	gachaData.value = {
		gachaName: '',
		Characters: [],
		Summons: [],
		normalWeapons: [],
	}
	gachaResult.value = null
}

// 模擬抽卡
const simulateGacha = () => {
	// 收集所有角色和召喚石
	const allItems = [
		...gachaData.value.Characters.map((item: any) => ({ ...item, type: '角色' })),
		...gachaData.value.Summons.map((item: any) => ({ ...item, type: '召喚石' }))
	]

	if (allItems.length === 0) {
		ElMessage.warning('卡池中沒有可抽取的項目喵～')
		return
	}

	// 計算總機率（用於驗證）
	const totalRate = allItems.reduce((sum, item) => sum + item.rate, 0)

	// 生成 0 到 總機率 之間的隨機數
	const random = Math.random() * totalRate

	// 根據累積機率區間判斷抽到哪個 item
	let cumulativeRate = 0
	for (const item of allItems) {
		cumulativeRate += item.rate
		if (random <= cumulativeRate) {
			gachaResult.value = item
			ElMessage.success(`恭喜抽到了 ${item.name} 喵♡`)
			break
		}
	}
}

// 複製工具代碼
const copyToolCode = async () => {
	try {
		await navigator.clipboard.writeText(toolCode)
		ElMessage.success('已複製工具到剪貼簿，請存放到書籤網址，並在【提供割合】頁面使用')
		// throw new Error('模擬複製失敗')
	} catch (error) {
		ElMessage.error('笑死，工具壞啦！去找人修一下啦！')
		console.error('Copy failed:', error)
	}
}
</script>

<style lang="scss" scoped>
.gacha-parse {
  padding: 20px;

  .card-header {
    font-size: 16px;
    font-weight: 500;
  }

  .input-card {
    margin-bottom: 20px;

    .input-area {
      .action-buttons {
        margin-top: 15px;
        display: flex;
        gap: 10px;

        button.ml_auto {
          margin-left: auto;
        }
      }
    }
  }

  .result-card {
    .result-content {
      min-height: 200px;

      h2 {
        color: #303133;
        margin-bottom: 20px;
      }

      .items-section {
        margin-bottom: 30px;

        h3 {
          color: #606266;
          margin-bottom: 15px;
          font-size: 18px;
        }

        .item-wrapper {
          position: relative;
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .el-image {
            width: 100%;
            display: block;
          }

          // 黑色半透明遮罩
          .mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            transition: opacity 0.3s ease;
          }

          // 機率標籤
          .rate-badge {
            position: absolute;
            bottom: 5px;
            right: 5px;
            background-color: rgba(64, 158, 255, 0.9);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            z-index: 10;

            &.pickup {
              background-color: rgba(216, 165, 26, 0.9);
            }
          }

          // 未知項目名稱
          .unknown-name {
            user-select: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 15;
            color: #ffffff;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
            margin: 0;
            white-space: nowrap;
            max-width: 90%;
            overflow: hidden;
            text-overflow: ellipsis;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8),
                         -1px -1px 2px rgba(0, 0, 0, 0.8);
          }

          // 選中狀態
          &.selected {
            border: 3px solid #409eff;
            box-shadow: 0 0 15px rgba(64, 158, 255, 0.5);
          }
        }
      }

      .probability-section {
        margin-top: 30px;

        h3 {
          color: #303133;
          margin-bottom: 20px;
          font-size: 20px;
        }

        .probability-stats {
          display: flex;
          gap: 40px;
          padding: 20px;
          background-color: #f5f7fa;
          border-radius: 8px;

          :deep(.el-statistic) {
            .el-statistic__head {
              color: #606266;
              font-size: 14px;
            }

            .el-statistic__content {
              color: #409eff;
              font-size: 28px;
              font-weight: 600;
            }
          }
        }
      }

      .gacha-simulation {
        margin-top: 30px;

        h3 {
          color: #303133;
          margin-bottom: 20px;
          font-size: 20px;
        }

        .gacha-result {
          margin-top: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);

          h4 {
            color: white;
            margin-bottom: 20px;
            font-size: 18px;
            text-align: center;
          }

          .result-item {
            display: flex;
            align-items: center;
            gap: 20px;
            background-color: white;
            padding: 20px;
            border-radius: 8px;

            .result-info {
              flex: 1;

              .result-name {
                font-size: 24px;
                font-weight: 600;
                color: #303133;
                margin-bottom: 10px;
              }

              .result-type {
                font-size: 16px;
                color: #909399;
                margin-bottom: 5px;
              }

              .result-rate {
                font-size: 14px;
                color: #409eff;
                font-weight: 500;
              }
            }
          }
        }
      }
    }
  }
}
</style>