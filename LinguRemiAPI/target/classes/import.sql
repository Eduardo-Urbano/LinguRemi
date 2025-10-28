INSERT INTO Usuarios (nome_Usuarios, email_Usuarios, senha_Usuarios, role_Usuarios)VALUES ('Giovanni França', 'giovanni@email.com', '12345', '1');
INSERT INTO Usuarios (nome_Usuarios, email_Usuarios, senha_Usuarios, role_Usuarios)VALUES ('Maria Oliveira', 'maria.oliveira@email.com', 'abcde', '1');
INSERT INTO Usuarios (nome_Usuarios, email_Usuarios, senha_Usuarios, role_Usuarios)VALUES ('Carlos Santos', 'carlos.santos@email.com', 'senha123', '0');


INSERT INTO Historico (id_Usuarios, email_Transferencia, valor_Transferencia, data_Transferencia, desc_Transferencia) VALUES (1, 'maria.oliveira@email.com', 150.00, '2025-10-08T14:30:00Z', 'Transferência para Maria');
INSERT INTO Historico (id_Usuarios, email_Transferencia, valor_Transferencia, data_Transferencia, desc_Transferencia) VALUES (1, 'carlos.santos@email.com', 50.00, '2025-10-07T09:15:00Z', 'Almoço dividido');
INSERT INTO Historico (id_Usuarios, email_Transferencia, valor_Transferencia, data_Transferencia, desc_Transferencia) VALUES (2, 'giovanni@email.com', 200.00, '2025-10-06T18:00:00Z', 'Pagamento de serviço');
INSERT INTO Historico (id_Usuarios, email_Transferencia, valor_Transferencia, data_Transferencia, desc_Transferencia) VALUES (3, 'maria.oliveira@email.com', 75.50, '2025-10-05T12:00:00Z', 'Compra compartilhada');

INSERT INTO RECEITAS (NOME_RECEITAS, INGREDIENTES_RECEITAS, MODO_DE_PREPARO_RECEITAS, VALOR_RECEITAS, IMG_RECEITAS, PARA_PRODUTOS, AUTOR_EMAIL, AUTOR_ROLE) VALUES('Cheesecake de Frutas Vermelhas', 'Sobremesa cremosa com calda de frutas vermelhas.', 'Salada clássica com alface romana, frango grelhado e molho caesar.', 18.75, 'C:\\Users\\Giovanni\\Desktop\\LinguRemi\\uploads\\doce2', FALSE, 'giovanni@email.com', 'ADMIN');