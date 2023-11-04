-- Inseert Tony, Stark, tony@starkent.com, Iam1ronM@n to Account
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Modify the Tony Stark account to Admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Delete Tony Stark record from database
DELETE FROM public.account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Update/Replace GM Hummer description from small interiors to huge interiors
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Inner Join to select make and model from inventory table and the classification 
-- name field from the classification table for items that belong to "Sport"
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory AS i
INNER JOIN public.classification AS c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Update all records in the inventory table to add "/vehicles" to the middle of 
-- the file path in the inv_image and inv_thumbnail columns using a single query. 
-- When done the path for both inv_image and inv_thumbnail should resemble this 
-- example: /images/vehicles/a-car-name.jpg 
-- USE CONCAT to concat the new path with the original path start at the 8th character
-- SUBSTRING to exclude the initial "/images" part

UPDATE public.inventory
SET
  inv_image = CONCAT('/images/vehicles', SUBSTRING(inv_image, 8)),
  inv_thumbnail = CONCAT('/images/vehicles', SUBSTRING(inv_thumbnail, 8));

