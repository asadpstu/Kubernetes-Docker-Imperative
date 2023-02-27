Instruction :

Install Docker,kubenetes,kubectl,minikube in your system.

Installation of Docker:  https://docs.docker.com/engine/install/ubuntu/
https://phoenixnap.com/kb/install-kubernetes-on-ubuntu
After Installation start docker :
sudo apt-get update
sudo apt-get install docker.io
docker --version
sudo systemctl enable docker

====================================================================
Issue:
ubuntu@ip-172-31-14-166 $ sudo systemctl enable docker
Synchronizing state of docker.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install enable docker


To solve this Issue => unmusk it.
sudo systemctl unmask docker
|
|
sudo systemctl status docker
sudo systemctl start docker
Command : 
      sudo systemctl start docker
      sudo systemctl status docker

Installation of Kubenetes Tools:


prerequisite:

curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add
sudo apt-get install curl
sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"



Step1 : sudo curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
Step2 : sudo chmod +x ./kubectl
Step3 : sudo mv ./kubectl /usr/local/bin/kubectl 
Step4 : kubectl version --client
Download Minikube => curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 
Step5 : sudo install minikube-linux-amd64 /usr/local/bin/minikube
Step6 : minikube start --driver=docker
        => May see a error.
        => Read the error and execute the command from error message
        => For My Case => sudo usermod -aG docker $USER && newgrp docker
        => Then repeat step 6
=========================================================
  Use "Docker" as default virtualization environment.
=========================================================


Step 1 : (Create Docker Image)
   Shell command _: docker build -t kub-node-app .
Step 2 : (Create Docker Repository to Docker Hub)
   asad183099/kub-node-app   <= My Docker Hub Repo Name
Step 3 : Push Docker Image to Docker Hub  
   Shell command _: docker images
   Shell command _: docker tag kub-node-app asad183099/kub-node-app    
   Shell command _: docker push asad183099/kub-node-app
   Note : [kub-node-app] is local docker images     
          [asad183099/kub-node-app] is docker-hub Repository => hub.docker.com/
Step 4 :
   Shell command _: minikube start
   Shell command _: kubectl create deployment first-app --image=asad183099/kub-node-app
   Note : [asad183099/kub-node-app] is docker-hub Repository name that we just pushed
          [first-app] is the pod name that will contain our containerized app
Step 5 :
   Shell command _: kubectl get deployments
   --------------------------------------------------------
   NAME        READY   UP-TO-DATE   AVAILABLE   AGE        
   first-app   1/1     1            1           35m        
   --------------------------------------------------------

   Shell command _: minikube dashboard
   Note : [It will open kubenetes dashboard in the browser]

Step 6 : 
   Shell command _: kubectl expose deployment first-app --type=LoadBalancer --port=8080
   Note : [8080 is our app running port]  Reference : Node code : app.listen(8080); 
   Note : [This command will create a service behind the scene]
   Shell command _: kubectl get services
   ---------------------------------------------------------------------------------
   first-app    LoadBalancer   10.101.29.83   <pending>     8080:30716/TCP   19m
   kubernetes   ClusterIP      10.96.0.1      <none>        443/TCP          14h
   ---------------------------------------------------------------------------------

   Shell command _: minikube service first-app
   Done!
   Note : It will open an url represnting your application

   Creating scale of replicas
   Shell command _: kubectl scale deployment/first-app --replicas=3
   Note : ["first-app" is the kubernates deployment name that just been deployed]

   --------------------------------------------------------------------------------
   Important Task :: When source code get updated ?
   -------------------------------------------------------------------------------- 
   
   Rebuild Docker Image
   Shell command _: docker build -t kub-node-app:v1 .
   Note : [v1,v2,v3....vn is the tag] . Adding tag is mandatory. Otherwise kubernetes will no fetch the updated Docker image.

   tagging latest image to docker hub:
   Shell command _: docker tag kub-node-app:v1 asad183099/kub-node-app:v1

   docker push:
   Shell command _: docker push asad183099/kub-node-app:v1

   updating/setting deployment image with latest pushed docker image
   Shell command _: kubectl set image deployment/first-app kub-node-app=asad183099/kub-node-app:v1
   Note : ["kub-node-app" => Kubernetes dashboard => pods => containername]

   To check updated content:
   Shell command _: kubectl rollout status deployment/first-app

   Check Application:  
   Shell command _: minicube service first-app 
   Note : [to get all service list : =>  kubectl get services ]




=============================================================================
For Aws deployment
=============================================================================
if virtualiztion environment set as docker, have to delete first.
minikube delete
minikube start --driver=none   
sudo -i
kubectl get pods
kubectl create deployment first-app-without-docker-virtualization --image=asad183099/kub-node-app
kubectl get deployments
kubectl expose deployment first-app-without-docker-virtualization --type=NodePort --port=8080
kubectl get svc
NAME                                      TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
first-app-without-docker-virtualization   NodePort    10.109.95.88   <none>        8080:30853/TCP   13s
kubernetes                                ClusterIP   10.96.0.1      <none>        443/TCP          3m29s

-:: Expose 30853 port in security group::-
curl -v 13.212.171.232:30853
