import express from 'express';
import { supabase } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create payment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    const userId = req.user.id;

    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        course_id: courseId,
        amount,
        currency: 'BRL',
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ payment });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user payments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select(`
        *,
        courses (title, thumbnail)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;