<?php

declare(strict_types=1);

it('may welcome the user', function (): void {
    $page = visit('/');

    $page->assertTitleContains('Welcome')
        ->assertSee('all in one place')
        ->assertNoJavaScriptErrors();
});
