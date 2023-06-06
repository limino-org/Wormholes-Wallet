import { provide, inject } from "vue";
import { useI18n } from "vue-i18n";

export function useProvideI18n(): void {
   const { t } = useI18n();
   provide("t", t);
}

export function useInjectI18n(): (text: string) => string {
  const t = inject("t") as (text: string) => string;
  return t;
}
