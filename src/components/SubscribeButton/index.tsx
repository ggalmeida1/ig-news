/* eslint-disable react-hooks/rules-of-hooks */
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss'

interface subscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: subscribeButtonProps) {
  const [ session ] = useSession();

  async function handleSubscribe() {
    if(!session) {
      signIn('github')
      return;
    }

    try { 
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe.redirectToCheckout({sessionId})
    } catch (error) {
      alert('Error: ' + error.message)
    }

  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}