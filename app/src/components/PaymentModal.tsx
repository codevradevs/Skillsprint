import { useState, useRef } from 'react';
import { paymentAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Smartphone } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  amount: number;
  courseTitle: string;
  paymentType?: 'course' | 'subscription';
  onSuccess?: () => void;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  courseId,
  amount,
  courseTitle,
  paymentType = 'course',
  onSuccess
}: PaymentModalProps) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');
  const [, setCheckoutId] = useState('');
  const statusRef = useRef<'idle' | 'pending' | 'success' | 'failed'>('idle');

  const updateStatus = (s: 'idle' | 'pending' | 'success' | 'failed') => {
    statusRef.current = s;
    setStatus(s);
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    }
    if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '254' + cleaned;
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedPhone = formatPhone(phone);
    if (!/^2547\d{8}$/.test(formattedPhone)) {
      return;
    }

    setLoading(true);
    try {
      const response = await paymentAPI.stkPush({
        phone: formattedPhone,
        amount,
        courseId,
        paymentType
      });
      
      setCheckoutId(response.data.data.checkoutRequestID);
      updateStatus('pending');
      
      const checkInterval = setInterval(async () => {
        try {
          const statusResponse = await paymentAPI.checkStatus(response.data.data.checkoutRequestID);
          if (statusResponse.data.data.status === 'success') {
            clearInterval(checkInterval);
            updateStatus('success');
            setTimeout(() => {
              onSuccess?.();
              onClose();
            }, 2000);
          } else if (statusResponse.data.data.status === 'failed') {
            clearInterval(checkInterval);
            updateStatus('failed');
          }
        } catch (error) {
          console.error('Status check error:', error);
        }
      }, 3000);

      setTimeout(() => {
        clearInterval(checkInterval);
        if (statusRef.current === 'pending') {
          updateStatus('failed');
        }
      }, 60000);

    } catch (error) {
      console.error('Payment error:', error);
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    updateStatus('idle');
    setPhone('');
    setCheckoutId('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { reset(); onClose(); } }}>
      <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {paymentType === 'subscription' ? 'Subscribe to Premium' : 'Unlock Course'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {paymentType === 'subscription' 
              ? 'Get unlimited access to all courses'
              : courseTitle
            }
          </DialogDescription>
        </DialogHeader>

        {status === 'idle' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-white">Ksh {amount.toLocaleString()}</div>
              {paymentType === 'course' && (
                <div className="text-sm text-gray-400 mt-1">One-time payment</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">M-Pesa Phone Number</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 bg-[#0a0a0a] border-white/10 text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">Enter your M-Pesa registered number</p>
            </div>

            <Button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay with M-Pesa'
              )}
            </Button>

            {(courseId || paymentType === 'subscription') && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoading(true);
                    if (paymentType === 'subscription') {
                      await paymentAPI.testSubscribe();
                    } else {
                      await paymentAPI.testEnroll(courseId!);
                    }
                    updateStatus('success');
                    setTimeout(() => { onSuccess?.(); onClose(); }, 1500);
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full text-center text-xs text-gray-500 hover:text-purple-400 mt-2 underline"
              >
                Skip payment (test mode)
              </button>
            )}
          </form>
        )}

        {status === 'pending' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Check Your Phone</h3>
            <p className="text-gray-400 text-sm">
              Enter your M-Pesa PIN on your phone to complete the payment
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Payment Successful!</h3>
            <p className="text-gray-400 text-sm">
              {paymentType === 'subscription' 
                ? 'Welcome to Premium! Enjoy unlimited access.'
                : 'You now have full access to the course.'
              }
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Payment Failed</h3>
            <p className="text-gray-400 text-sm mb-4">
              Something went wrong. Please try again.
            </p>
            <Button onClick={reset} variant="outline" className="border-white/10">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
