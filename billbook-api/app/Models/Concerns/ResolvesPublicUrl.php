<?php

namespace App\Models\Concerns;

trait ResolvesPublicUrl
{
    protected function resolvePublicStorageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        $relativePath = 'media/' . ltrim($path, '/');

        return config('filesystems.disks.public.relative_urls')
            ? '/' . $relativePath
            : asset($relativePath);
    }
}
