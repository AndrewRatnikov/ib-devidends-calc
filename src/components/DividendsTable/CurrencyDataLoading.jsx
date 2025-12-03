import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Spinner } from '@/components/ui/spinner';

export default function CurrencyDataLoading() {
  return (
    <div className="flex items-center justify-center m-3">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">Loading ...</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  );
}
