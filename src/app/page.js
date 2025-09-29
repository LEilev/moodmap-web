// src/app/page.js
import {redirect} from 'next/navigation';

export const dynamic = 'force-static';

export default function RootRedirect() {
  redirect('/en');
}
