
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n";

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  return (
    <Button
      variant="ghost"
      onClick={() => setLanguage(language === "en" ? "vi" : "en")}
    >
      {language.toUpperCase()}
    </Button>
  );
}
