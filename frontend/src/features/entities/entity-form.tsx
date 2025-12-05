'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { createEntityAction } from '@/actions/entities';

type EntityFormState = {
  message?: string;
  error?: string;
};

const initialState: EntityFormState = {
  message: undefined,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Saving…' : 'Create Entity'}
    </button>
  );
}

export function EntityForm() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  const boundAction = createEntityAction.bind(null, search);
  const [state, formAction] = useActionState(boundAction, initialState);

  return (
    <form
      key={state?.error ?? 'initial'}
      action={formAction}
      className="w-full space-y-4 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label htmlFor="something" className="block text-sm font-medium text-zinc-700">
          Something
        </label>

        <input
          id="something"
          name="something"
          type="text"
          placeholder="Enter a value"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-base text-zinc-900 shadow-xs outline-none ring-2 ring-transparent transition focus:border-zinc-500 focus:ring-zinc-200"
          required
          autoFocus
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}
