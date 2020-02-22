<template>
  <article class="content">
    <header><h1>{{ $metaInfo.title }}</h1></header>

    <section>
      <h2>Normal</h2>
      <p>Gravida qui saepe tellus ut ultricies modi curabitur! Nulla? Nobis earum quisquam facilisi sequi ridiculus ligula sint hymenaeos donec nemo ipsam, nascetur possimus diamlorem, natoque iusto, fringilla, consectetuer. Sociis soluta accusamus porttitor, rutrum primis nibh sociosqu? Aliqua hymenaeos. Distinctio? Exercitationem? Eius penatibus curabitur doloribus, doloribus scelerisque hac voluptate! Sequi! Volutpat beatae aliquam esse condimentum, iusto imperdiet cubilia blandit odio nostrum sit voluptate? Quaerat nonummy erat reiciendis augue dicta vitae adipisci, urna eius, congue quam dicta? Hic. Qui viverra, egestas laoreet! Facere ipsa iusto harum, beatae gravida harum, litora mollit quibusdam facilisi dolorem phasellus montes. Rutrum vel gravida iste esse ligula.</p>
    </section>

    <section>
      <h2>Light</h2>
      <p class="light">
        Gravida qui saepe tellus ut ultricies modi curabitur! Nulla? Nobis earum quisquam facilisi sequi ridiculus ligula sint hymenaeos donec nemo ipsam, nascetur possimus diamlorem, natoque iusto, fringilla, consectetuer. Sociis soluta accusamus porttitor, rutrum primis nibh sociosqu? Aliqua hymenaeos. Distinctio? Exercitationem? Eius penatibus curabitur doloribus, doloribus scelerisque hac voluptate! Sequi! Volutpat beatae aliquam esse condimentum, iusto imperdiet cubilia blandit odio nostrum sit voluptate? Quaerat nonummy erat reiciendis augue dicta vitae adipisci, urna eius, congue quam dicta? Hic. Qui viverra, egestas laoreet! Facere ipsa iusto harum, beatae gravida harum, litora mollit quibusdam facilisi dolorem phasellus montes. Rutrum vel gravida iste esse ligula.
      </p>
    </section>

    <section>
      <h2>Bold</h2>
      <p class="bold">
        Cum natus eveniet condimentum aliquid, repudiandae ultrices est, cumque fringilla? Repellendus deleniti non quidem a, recusandae harum in, nemo! Aut rhoncus alias risus sem? Facere fugiat, magni animi reiciendis interdum mauris purus, laboriosam fringilla. Corporis dolores dis provident aperiam ipsam. Vivamus tellus, temporibus a luctus, nesciunt, rutrum similique nostrum. Temporibus quisquam, rerum maecenas, diam, risus, volutpat, viverra proin accusamus maecenas, nibh justo animi, mauris proin? A congue debitis architecto? Varius aptent minus pellentesque rutrum, quas rutrum dis, scelerisque massa nunc anim sociis dignissimos libero, viverra, suspendisse vehicula, vulputate? Distinctio et. Condimentum atque fugit necessitatibus odit molestie sodales voluptatibus doloremque. Suscipit.
      </p>
    </section>

    <section>
      <h2>Italic</h2>
      <p class="italic">
        Cum natus eveniet condimentum aliquid, repudiandae ultrices est, cumque fringilla? Repellendus deleniti non quidem a, recusandae harum in, nemo! Aut rhoncus alias risus sem? Facere fugiat, magni animi reiciendis interdum mauris purus, laboriosam fringilla. Corporis dolores dis provident aperiam ipsam. Vivamus tellus, temporibus a luctus, nesciunt, rutrum similique nostrum. Temporibus quisquam, rerum maecenas, diam, risus, volutpat, viverra proin accusamus maecenas, nibh justo animi, mauris proin? A congue debitis architecto? Varius aptent minus pellentesque rutrum, quas rutrum dis, scelerisque massa nunc anim sociis dignissimos libero, viverra, suspendisse vehicula, vulputate? Distinctio et. Condimentum atque fugit necessitatibus odit molestie sodales voluptatibus doloremque. Suscipit.
      </p>
    </section>
  </article>
</template>

<script>

export default {
  head () {
    return {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Fonts Example: Two Fonts with total 6 Files'
    }
  }
}

</script>

<style lang="postcss">

body {
  margin: 0;
  font-size: 16px;
  color: #333;
  background: #fff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (prefers-color-scheme: light) {
  body {
    color: #333;
    background: #fff;
  }
}

@media (prefers-color-scheme: dark) {
  body {
    color: #fff;
    background: #333;
  }
}

.content {
  width: 90%;
  margin: 0 auto;

  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    font-family: serif;
    font-weight: normal;
    text-shadow: 10px 10px #ddd;

    @media (prefers-color-scheme: dark) {
      text-shadow: 10px 10px black;
    }

    @nest .font_roboto_slab_400_normal & {
      font-family: 'Roboto Slab', serif;
    }
  }

  & h1 {
    font-family: serif;

    @nest .font_roboto_slab_700_normal & {
      font-family: 'Roboto Slab', serif;
      font-weight: 700;
    }

    text-shadow: 10px 10px #ddd;

    @media (prefers-color-scheme: dark) {
      text-shadow: 10px 10px black;
    }
  }

  & p {
    font-family: sans-serif;
    font-style: normal;
    font-weight: 400;

    @nest .font_roboto_400_normal & {
      font-family: 'Roboto', sans-serif;
    }

    &.bold {
      font-family: sans-serif;
      font-weight: 700;

      @nest .font_roboto_700_normal & {
        font-family: 'Roboto', sans-serif;
      }
    }

    &.light {
      font-family: sans-serif;
      font-weight: 300;

      @nest .font_roboto_300_normal & {
        font-family: 'Roboto', sans-serif;
      }
    }

    &.italic {
      font-family: sans-serif;
      font-style: italic;
      font-weight: 400;

      @nest .font_roboto_400_italic & {
        font-family: 'Roboto', sans-serif;
      }
    }
  }
}
</style>
