import { Component, createEffect, Suspense } from 'solid-js';
import { useRouteData } from 'solid-app-router';

export default function About() {
  const name = useRouteData<() => string>();

// on keydown shortcut, prompt for a color and/or gradient (2 colors) so app nav/theme can be previewed by marketing team easily at any time with any color input

  createEffect(() => {
    console.log(name());
  });

  return (
    <section class="text-gray-700 p-8">
      <h1 class="text-2xl font-bold">About</h1>

      <p class="mt-4">A page all about this website.</p>

      <p>
        <span>We love</span>
        <Suspense fallback={<span>...</span>}>
          <span>&nbsp;{name()}</span>
        </Suspense>
      </p>
    </section>
  );
}
