<template>
  <div class="home-container">
    <section class="intro">
      <h1>JSON Forms + Kongponents</h1>
      <p>
        This is a PoC on how to fully control a form using <a target="_blank" href="https://jsonforms.io/">JSON Forms</a> with a custom layout. <br />
        Github: <a target="_blank" href="https://github.com/2eha0/learn-jsonforms">https://github.com/2eha0/learn-jsonforms</a> <br />
        Live Demo: <a target="_blank" href="https://learn-json-form.vercel.app/">https://learn-json-form.vercel.app/</a>
      </p>
      <ul class="features">
        <li>
          <i>📝</i>
          <span>A <b>form generator</b> based on JSON Schema</span>
        </li>
        <li>
          <i>🎨</i>
          <span><b>Full control</b> over form layout using UI Schema</span>
        </li>
        <li>
          <i>🔧</i>
          <span><b>Custom UI</b> rendering by extending UI Schema</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  height: 100%;
}

.intro {
  margin-bottom: 80px;
  text-align: center;
}

.intro p {
  margin-bottom: 20px;
}

.intro h2 {
  margin-top: 40px;
}

.features {
  list-style: none;
  padding: 0 40px;
  display: flex;
  gap: 80px;

  li {
    flex: 1;
  }
}

.features i {
  font-size: 40px;
  display: block;
}

h1 {
  margin-bottom: 20px;
}
</style>
