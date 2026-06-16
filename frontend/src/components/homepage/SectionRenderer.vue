<template>
  <div v-if="section.enabled">
    <!-- Hero -->
    <HeroBlock v-if="section.type === 'hero'" :content="section.content" :title="section.title" :subtitle="section.subtitle" />

    <!-- Product grids -->
    <ProductGridBlock
      v-else-if="['featured', 'best_sellers', 'trending', 'product_grid'].includes(section.type)"
      :content="section.content"
      :title="section.title"
      :subtitle="section.subtitle"
      :type="section.type"
    />

    <!-- Stats -->
    <StatsBlock v-else-if="section.type === 'social_proof'" :content="section.content" :title="section.title" :subtitle="section.subtitle" />

    <!-- Testimonials -->
    <TestimonialsBlock v-else-if="section.type === 'testimonials'" :content="section.content" :title="section.title" :subtitle="section.subtitle" />

    <!-- Benefits -->
    <BenefitsBlock v-else-if="section.type === 'benefits'" :content="section.content" :title="section.title" :subtitle="section.subtitle" />

    <!-- FAQ -->
    <FaqBlock v-else-if="section.type === 'faq'" :content="section.content" :title="section.title" :subtitle="section.subtitle" />

    <!-- Newsletter -->
    <NewsletterBlock v-else-if="section.type === 'newsletter'" :content="section.content" :title="section.title" :subtitle="section.subtitle" />

    <!-- Brands -->
    <BrandsBlock v-else-if="section.type === 'brands'" :content="section.content" :title="section.title" :subtitle="section.subtitle" />

    <!-- Category Showcase -->
    <CategoryShowcaseBlock v-else-if="section.type === 'category_showcase'" :content="section.content" :title="section.title" :subtitle="section.subtitle" />

    <!-- Promo Block -->
    <PromoBlock v-else-if="section.type === 'promo_block'" :content="section.content" />

    <!-- Custom HTML -->
    <CustomHtmlBlock v-else-if="section.type === 'custom_html'" :content="section.content" />

    <!-- Banner Carousel -->
    <BannerCarouselBlock v-else-if="section.type === 'banner_carousel'" :content="section.content" />
  </div>
</template>

<script setup>
import HeroBlock from './HeroBlock.vue'
import ProductGridBlock from './ProductGridBlock.vue'
import StatsBlock from './StatsBlock.vue'
import TestimonialsBlock from './TestimonialsBlock.vue'
import BenefitsBlock from './BenefitsBlock.vue'
import FaqBlock from './FaqBlock.vue'
import NewsletterBlock from './NewsletterBlock.vue'
import BrandsBlock from './BrandsBlock.vue'
import CategoryShowcaseBlock from './CategoryShowcaseBlock.vue'
import PromoBlock from './PromoBlock.vue'
import CustomHtmlBlock from './CustomHtmlBlock.vue'
import BannerCarouselBlock from './BannerCarouselBlock.vue'

defineProps({ section: { type: Object, required: true } })
</script>
