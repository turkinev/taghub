
# Header Navigation Enhancement

## What will be added

The admin header bar will be expanded with three sections:

1. **Left side**: Burger menu button + "Вернуться на сайт" link
2. **Center/Right navigation**: Horizontal links -- Администрирование, Модерирование, Организатор, Бухгалтерия, Маркетинг, Статистика, ПВЗ
3. **Profile icon (far right)**: User icon with a dropdown menu containing: Избранные закупки, Список желаний, Личный кабинет, Профиль, Рейтинг, Отправить заявку, Ваши сообщения, Выход

## Technical Details

### File: `src/layouts/AdminLayout.tsx`

Restructure the header into three zones using flexbox:

```text
[Burger] [Вернуться на сайт]  ...  [Адм | Мод | Орг | Бух | Мар | Стат | ПВЗ] [Avatar Dropdown]
```

- **Left zone**: Existing burger `Button` + an `<a>` or link "Вернуться на сайт" with `ArrowLeft` icon
- **Right zone**: Navigation items as simple text links/buttons styled inline, separated visually. Wrap in a `<nav>` with `flex items-center gap-1` and use small text buttons
- **Profile dropdown**: Use the existing `DropdownMenu` component from `src/components/ui/dropdown-menu.tsx` with a `User` icon trigger. Menu items:
  - Избранные закупки
  - Список желаний
  - Личный кабинет
  - Профиль
  - Рейтинг
  - Отправить заявку
  - Ваши сообщения
  - Separator
  - Выход (styled destructively)

- On smaller screens, the center nav links will scroll horizontally (`overflow-x-auto`) or be hidden behind a "more" menu to keep things usable.

### Imports needed
- `ArrowLeft`, `User`, `LogOut` from `lucide-react`
- `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator` from UI components

No new files needed -- all changes in `AdminLayout.tsx`.
