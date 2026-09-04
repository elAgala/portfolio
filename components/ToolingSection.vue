<script setup lang="ts">
import { everydayTools } from '~/data/tooling'
</script>

<template>
  <section id="tooling" class="section tooling" aria-labelledby="tooling-title">
    <header class="tooling-heading">
      <p class="section-index">Current tooling</p>
      <h2 id="tooling-title">My everyday tools.</h2>
      <p class="tooling-intro">What I use to write, navigate and review code.</p>
    </header>
    <dl class="tooling-list">
      <div v-for="tool in everydayTools" :key="tool.name" class="tooling-item">
        <dt>
          <span class="tooling-role">{{ tool.role }}</span>
          <span class="tooling-name">{{ tool.name }}</span>
        </dt>
        <dd>{{ tool.description }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.tooling {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 48px 24px;
}

.tooling-heading {
  grid-column: 1 / 5;
}

.tooling-heading h2 {
  max-width: 10ch;
  margin-top: 28px;
  font-size: clamp(44px, 4.5vw, 72px);
  font-stretch: 88%;
  font-weight: 680;
  letter-spacing: -0.06em;
  line-height: 0.96;
}

.tooling-intro {
  max-width: 28ch;
  margin-top: 24px;
  color: var(--stone);
}

.tooling-list {
  display: grid;
  grid-column: 6 / 13;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px 32px;
}

.tooling-item {
  padding-top: 16px;
  border-top: 1px solid var(--line-strong);
}

.tooling-role {
  display: block;
  color: var(--brass);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.tooling-name {
  display: block;
  margin-top: 12px;
  font-size: 28px;
  font-weight: 550;
  letter-spacing: -0.035em;
  line-height: 1.2;
}

.tooling-item dd {
  margin-top: 12px;
  color: var(--stone);
  font-size: 15px;
  line-height: 1.65;
}

@media (max-width: 900px) {
  .tooling-heading { grid-column: 1 / -1; }
  .tooling-heading h2 { max-width: none; }
  .tooling-list { grid-column: 1 / -1; }
}

@media (max-width: 520px) {
  .tooling-list { grid-template-columns: minmax(0, 1fr); gap: 28px; }
}
</style>
