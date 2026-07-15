update public.business_settings
set settings = jsonb_set(
  settings,
  '{phone_verification}',
  jsonb_build_object(
    'mode',
    case
      when coalesce((settings->'phone_verification'->>'otp_enabled')::boolean, true)
        then 'test'
      else 'off'
    end,
    'required_for',
    jsonb_build_object(
      'registration',
      coalesce(
        (settings->'phone_verification'->>'verification_required_for_registration')::boolean,
        true
      ),
      'checkout',
      coalesce(
        (settings->'phone_verification'->>'verification_required_for_checkout')::boolean,
        false
      ),
      'profile_update',
      coalesce(
        (settings->'phone_verification'->>'verification_required_for_profile_update')::boolean,
        false
      )
    )
  ),
  true
),
updated_at = now()
where id = 'default'
  and settings ? 'phone_verification'
  and not (settings->'phone_verification' ? 'mode');
