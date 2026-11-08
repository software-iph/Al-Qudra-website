import { Icon, ICON_NAMES } from "@/components/site/Icon";

/** Radio grid of the icons that the website can show. Works without JavaScript. */
export function IconPicker({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ICON_NAMES.map((icon) => (
        <label key={icon} title={icon} className="cursor-pointer">
          <input type="radio" name={name} value={icon} defaultChecked={icon === value} className="peer sr-only" />
          <span className="flex size-10 items-center justify-center rounded-xl text-navy-700 ring-1 ring-line transition peer-checked:bg-navy-700 peer-checked:text-white peer-checked:ring-navy-700 hover:bg-paper peer-checked:hover:bg-navy-700 peer-focus-visible:ring-2 peer-focus-visible:ring-sky">
            <Icon name={icon} className="size-5" />
          </span>
        </label>
      ))}
    </div>
  );
}
