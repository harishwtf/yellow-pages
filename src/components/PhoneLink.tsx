import { COPY } from '../data/ui';
import { useLongPress } from '../hooks/useLongPress';
import { copyText } from '../lib/clipboard';
import { telHref } from '../lib/phone';
import { Icon } from './icons';

interface PhoneLinkProps {
  name: string;
  phone: string;
  onNotify: (text: string) => void;
}

/** The number: a tel: link (the Call button on a phone), with a copy icon; touch-and-hold also copies. */
export function PhoneLink({ name, phone, onNotify }: PhoneLinkProps) {
  const copy = async () => {
    onNotify((await copyText(phone)) ? COPY.copied : COPY.copyFailed);
  };
  const press = useLongPress(copy);

  return (
    <span className="slot">
      <a className="phone" href={telHref(phone)} aria-label={`Call ${name}, ${phone}`} translate="no" {...press}>
        <Icon name="phone" className="phone__glyph" />
        {phone}
      </a>
      <button type="button" className="copy" aria-label={`Copy the number for ${name}`} onClick={copy}>
        <Icon name="copy" />
      </button>
    </span>
  );
}
