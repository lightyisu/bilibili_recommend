<template>
  <n-scrollbar style="max-height: 100vh">
    <nav>
      <h1>
        <img :style="{ width: '120px' }" src="./assets/Recommend.png" />
      </h1>
    </nav>
    <div class="root">
      <n-button @click.native="refresh" class="refresh_btn" type="info" round>
        刷新
        <template #icon>
          <n-icon :style="refresh_icon" class="refresh_icon">
            <Refresh />
          </n-icon>
        </template>
      </n-button>
      <br />
      <div v-if="!internetStatus" class="content">
        <div class="wrapper" v-for="(item, index) in items" :key="index">
          <n-card hoverable>
            <template v-if="!loading" #cover>
              <a :href="item.uri" target="_blank">
                <img :src="item.pic + '@672w_378h_1c.webp'" />
              </a>
            </template>
            <template v-if="loading" #cover>
              <n-skeleton height="100px" width="100%" />
            </template>
          </n-card>
          <n-card v-if="!loading" class="desc">
            {{ item.title }}
          </n-card>
          <div class="video-info">
            <n-button
              size="tiny"
              v-if="!loading"
              strong
              secondary
              round
              type="info"
            >
              <template #icon>
                <n-icon>
                  <BrandGooglePlay />
                </n-icon>
              </template>
              {{ formatView(item.stat.view) }}
            </n-button>
            <n-button
              size="tiny"
              v-if="!loading"
              strong
              secondary
              round
              type="info"
            >
              <template #icon>
                <n-icon>
                  <LikeOutlined />
                </n-icon>
              </template>
              {{ formatView(item.stat.like) }}
            </n-button>
          </div>

          <n-skeleton
            v-if="loading"
            :sharp="false"
            height="30px"
            width="100%"
          />
        </div>
      </div>
      <div v-if="infinityLoading && !internetStatus" class="infinity-loading">
        <n-spin size="medium" />
      </div>

      <div class="infinity-boundary" v-if="!internetStatus">底部</div>
    </div>
    <n-result
      v-if="internetStatus == 'noInternet'"
      status="500"
      title="API错误"
      description="可能未连上后端服务器"
    >
      <template #footer>
        <n-button>好的</n-button>
      </template>
    </n-result>
  </n-scrollbar>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Refresh, Bolt, BrandGooglePlay } from "@vicons/tabler";
import { LikeOutlined } from "@vicons/antd";
import { getRecommend } from "./service/api";
import infiniteDetect from "./utils/infinityScroll";
import throttle from "./utils/throttle";
let items = ref("");
let loading = ref(true);
let infinityLoading = ref(false);
let refresh_icon = ref({
  transform: "rotate(0deg)",
});
let internetStatus = ref("");
let getTheData = () => {
  loading.value = true;
  getRecommend()
    .then((res) => {
      internetStatus.value = "";
      items.value = res.data.item;
      loading.value = false;
    })
    .catch((err) => {
      console.log("err", err);
      internetStatus.value = "noInternet";
    });
};
let appendTheData = () => {
  infinityLoading.value = true;
  getRecommend().then((res) => {
    items.value.push(...res.data.item);
    infinityLoading.value = false;
  });
};
let refresh = () => {
  if (refresh_icon.value.transform != "rotate(360deg)") {
    refresh_icon.value = {
      transform: "rotate(360deg)",
    };
  } else {
    refresh_icon.value = {
      transform: "rotate(0deg)",
    };
  }
  getTheData();
};
let formatView = (view) => {
  if (view >= 10000) {
    return (view / 10000).toFixed(2) + "万";
  }
  return view;
};

onMounted(() => {
  infiniteDetect(
    ".infinity-boundary",
    throttle(() => {
      console.log("ok");
      appendTheData();
    }, 2000)
  );
  getTheData();
});
</script>

<style lang="scss" scoped>
nav {
  text-align: center;
  background-color: #fff;
  padding: 6px;
}
.root {
  width: 1200px;
  margin: 40px auto;
  .refresh_btn {
    margin-left: 20px;
  }
  .refresh_icon {
    transition: transform 1s ease;
  }
  .content {
    min-height: 100vh;
  }
  .infinity-boundary {
    margin-top: 100px;
    text-align: center;
  }
  .infinity-loading {
    text-align: center;
  }
}
.wrapper {
  display: inline-block;
  vertical-align: top;
  width: 200px;
  margin: 40px 20px;
}
.n-card {
  max-width: 100%;

  display: inline-block;
  border-radius: 10px;
}
::v-deep .n-card-cover {
  border-radius: 10px;
}

::v-deep .n-card-header__main {
  height: 40px !important;
  overflow: hidden !important;
  font-size: 3px !important;
  font-weight: bold !important;
}
::v-deep .n-card__content {
  height: 64px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.desc {
  background-color: #fff;
  height: 80px;
  overflow: hidden;
  font-weight: bold;
  text-overflow: ellipsis;
}
</style>
