import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    
    // Verificar se é uma notificação de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Buscar detalhes do pagamento no Mercado Pago
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')}`,
        },
      });

      if (!mpResponse.ok) {
        throw new Error('Erro ao consultar pagamento no Mercado Pago');
      }

      const paymentData = await mpResponse.json();
      
      // Atualizar status do pagamento no Supabase
      const { error: updateError } = await supabaseClient
        .from('payments')
        .update({
          status: paymentData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('mercadopago_payment_id', paymentId);

      if (updateError) {
        throw updateError;
      }

      // Se o pagamento foi aprovado, liberar acesso ao curso
      if (paymentData.status === 'approved') {
        const { error: enrollmentError } = await supabaseClient
          .from('enrollments')
          .update({ access_granted: true })
          .eq('payment_id', paymentData.external_reference);

        if (enrollmentError) {
          throw enrollmentError;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});